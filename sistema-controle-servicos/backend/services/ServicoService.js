const { sequelize } = require('../db'); 

// Repositorios para criação, edição e exclusão
const ServicoRepo = require('../repositories/ServicoRepository')
const AlocacaoFuncRepo = require('../repositories/AlocacaoFuncionarioRepository')
const AlocacaoEquipRepo = require('../repositories/AlocacaoEquipamentoRepository')

// Repositorios para validação
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const ClienteRepo = require('../repositories/ClienteRepository')

const ServicoMapper = require('../mappers/servicoMapper')

const ServicoService = {
    getAll: async () => {
        const Servicos = await ServicoRepo.getAll(
            { include:[
                {model: require('../models/ModelCliente'), as: 'cliente'}
            ]}
        )
        const ServicosDTO = Servicos.map(S => ServicoMapper.toDTO(S))
        return ServicosDTO
    },

    getById: async (id) => {
        const Servico = await ServicoRepo.getById(id,
            {include: [
                {model: require('../models/ModelCliente'), as: 'cliente'}
            ]}
        )
        if (!Servico){
            return null
        }
        const ServicoDTO = ServicoMapper.toDTO(Servico)
        return ServicoDTO
    },

    create: async (dados) => {
        const t = await sequelize.transaction()

        try {

            // Validação do Cliente
            const cliente = await ClienteRepo.getById(dados.id_cliente)
            if (!cliente){
                throw new Error('Cliente Não Existe.')
            }

            // Criação do Serviço
            const dadosServico = {
                id_cliente: dados.id_cliente,
                nome: dados.nome,
                descricao: dados.descricao,
                data_inicio: dados.data_inicio, 
                data_fim: dados.data_fim,
                status: dados.status || 'agendado',
                orcamento: dados.orcamento
            }

            const novoServico = await ServicoRepo.save(dadosServico, {transaction: t})

            // Criação Alocações
            if (dados.alocacoes_diarias) {
                for (const data in dados.alocacoes_diarias){
                    const dia = dados.alocacoes_diarias[data]
                    const horasTrabalhadas = dia.horas_trabalhadas

                    // Alocação de Funcionarios
                    if (dia.funcionarios){
                        for (const alocFunc of dia.funcionarios){

                            // Validação funcionario
                            const funcionario = await FuncionarioRepo.getById(alocFunc.id_funcionario)
                            if(!funcionario){
                                throw new Error('Funcionario Não Existe')
                            }

                            const dadosAlocFunc = {
                                id_servico: novoServico.id,
                                id_funcionario: alocFunc.id_funcionario,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_dia_alocado: alocFunc.valor_dia_alocado
                            }
                            await AlocacaoFuncRepo.save(dadosAlocFunc, { transaction: t})
                        }
                    }

                    // Alocação de Equipamentos

                    if(dia.equipamentos) {
                        for(const alocEquip of dia.equipamentos){
                            // validação equipamento
                            const equipamento = await EquipamentoRepo.getById(alocEquip.id_equipamento)
                            if(!equipamento){
                                throw new Error('Equipamento Não Existe')
                            }
                            const dadosAlocEquip = {
                                id_servico: novoServico.id,
                                id_equipamento: alocEquip.id_equipamento,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_hora_alocada: alocEquip.valor_hora_alocada
                            }
                            await AlocacaoEquipRepo.save(dadosAlocEquip, { transaction: t})
                        }
                    }
                }
            }

            await t.commit()
            const novoServicoDTO = ServicoMapper.toDTO(novoServico)
            return novoServicoDTO;
        } catch (error){
            await t.rollback()
            throw new Error('Erro ao criar serviço: ' + error.message)
        }
        
    },

    update: async (id, dados) => {
        const t = await sequelize.transaction()

        try{
            // Validação Cliente
            const cliente = await ClienteRepo.getById(dados.id_cliente)
            if(!cliente){
                throw new Error('Cliente Não Existe')
            }
            // Valiação Serviço
            const servico = await ServicoRepo.getById(id, {
                include: [
                    { model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'},
                    { model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoesEquipamento'}
                ], 
                transaction: t
            })

            if (!servico) {
                throw new Error('Serviço Não Encontrado')
            }

            // Apaga todas as alocações para depois recriar
            for(const aloc of servico.alocacoesFuncionario || []){
                await AlocacaoFuncRepo.delete(aloc.id, {transaction: t})
            }
            for(const aloc of servico.alocacoesEquipamento || []){
                await AlocacaoEquipRepo.delete(aloc.id, {transaction: t})
            }

            // Recriação das alocações
            if (dados.alocacoes_diarias) {
                for (const data in dados.alocacoes_diarias){
                    const dia = dados.alocacoes_diarias[data]
                    const horasTrabalhadas = dia.horas_trabalhadas

                    // Alocação de Funcionarios
                    if (dia.funcionarios){
                        for (const alocFunc of dia.funcionarios){

                            // Validação funcionario
                            const funcionario = await FuncionarioRepo.getById(alocFunc.id_funcionario)
                            if(!funcionario){
                                throw new Error('Funcionario Não Existe')
                            }

                            const dadosAlocFunc = {
                                id_servico: id,
                                id_funcionario: alocFunc.id_funcionario,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_dia_alocado: alocFunc.valor_dia_alocado
                            }
                            await AlocacaoFuncRepo.save(dadosAlocFunc, { transaction: t})
                        }
                    }

                    // Alocação de Equipamentos

                    if(dia.equipamentos) {
                        for(const alocEquip of dia.equipamentos){
                            // validação equipamento
                            const equipamento = await EquipamentoRepo.getById(alocEquip.id_equipamento)
                            if(!equipamento){
                                throw new Error('Equipamento Não Existe')
                            }
                            const dadosAlocEquip = {
                                id_servico: id,
                                id_equipamento: alocEquip.id_equipamento,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_hora_alocada: alocEquip.valor_hora_alocada
                            }
                            await AlocacaoEquipRepo.save(dadosAlocEquip, { transaction: t})
                        }
                    }
                }
            }

            const dadosServico = {
                id_cliente: dados.id_cliente,
                nome: dados.nome, 
                descricao: dados.descricao,
                data_inicio: dados.data_inicio,
                data_fim: dados.data_fim,
                status: dados.status,
                orcamento: dados.orcamento
            }

            const servicoEdit = await ServicoRepo.update(id, dadosServico, {transaction: t})

            await t.commit()

            return servicoEdit
        } catch(error){
            await t.rollback()
            throw new Error('Erro ao atualizar serviço: ' + error.message)
        }
    },

    delete: async (id) => {
        const t = await sequelize.transaction()

        try {
            const servico = await ServicoRepo.getById(id, {
                include: [
                    {model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'},
                    {model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoesEquipamento'}
                ],
                transaction: t
            })

            if (!servico){
                throw new Error('Serviço não encontrado')
            }

            for (const aloc of servico.alocacoesFuncionario || []){
                await AlocacaoFuncRepo.delete(aloc.id, {transaction: t})
            }
            for (const aloc of servico.alocacoesEquipamento || []){
                await AlocacaoEquipRepo.delete(aloc.id, {transaction: t})
            }

            await ServicoRepo.delete(id, {transaction: t})

            await t.commit()

            return true
        }catch (error){
            await t.rollback()
            throw new Error('Erro ao deletar serviço: ' + error.message)
        }
    }
}

module.exports = ServicoService