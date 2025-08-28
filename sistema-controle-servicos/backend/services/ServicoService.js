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

const calcularStatus = (servico) => {
    if (servico.status === 'concluido') {
        return 'concluido'
    }
    const hoje = new Date()
    const dataInicio = new Date(servico.data_inicio)
    const dataFim = new Date(servico.data_fim)

    hoje.setHours(0,0,0,0)
    dataInicio.setHours(0,0,0,0)
    dataFim.setHours(0,0,0,0)

    if (hoje > dataFim)
        return 'concluido'
    else if (hoje >= dataInicio && hoje <= dataFim)
        return 'em execução'
    else
        return 'agendado'
}

const ServicoService = {
    getAll: async () => {
        const Servicos = await ServicoRepo.getAll(
            { include:[
                {model: require('../models/ModelCliente'), as: 'cliente'}
            ]}
        )
        const ServicosStatusAtt = Servicos.map(servico => {
            const servicoData = servico.get({ plain: true})
            servicoData.status = calcularStatus(servicoData)
            return servicoData
        })
        const ServicosDTO = ServicosStatusAtt.map(S => ServicoMapper.toDTO(S))
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

        const servicoData = servico.get({ plain: true})
        servicoData.status = calcularStatus(servicoData)
        const ServicoDTO = ServicoMapper.toDTO(servicoData)
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

            if (dadosServico.data_fim < dadosServico.data_inicio){
                throw new Error('A data final não pode ser anterior a data de inicio')
            }

            if (dadosServico.orcamento < 0){
                throw new Error('O orcamento não pode ser negativo')
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
                            const funcionario = await FuncionarioRepo.getById(alocFunc.id_funcionario,
                                {include: [{model: require('../models/ModelAlocacaoFuncionario'), as: "alocacoes"}]}
                            )
                            if(!funcionario){
                                throw new Error('Funcionario Não Existe')
                            }
                            if(!funcionario.status === 'inativo'){
                                throw new Error('O funcionario ' + funcionario.nome + ' está inativo e não pode ser alocado para serviço')
                            }
                            const conflito = await AlocacaoFuncRepo.findByFuncionarioData(alocFunc.id_funcionario, data)
                            if (conflito){
                                throw new Error('O Funcionario ' + funcionario.nome + ' já está alocado em outro serviço no dia ' + data)
                            }

                            const dadosAlocFunc = {
                                id_servico: novoServico.id,
                                id_funcionario: alocFunc.id_funcionario,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_dia_alocado: alocFunc.valor_dia_alocado
                            }
                            if(dadosAlocFunc.valor_dia_alocado < 0){
                                throw new Error('O valor da Diaria não pode ser negativo')
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
                            if(equipamento.status === "inativo"){
                                throw new Error('Equipamento ' + equipamento.nome +' está inativo e não pode ser alocado para serviço')
                            }
                            const conflito = await AlocacaoEquipRepo.findByEquipamentoData(alocEquip.id_equipamento, data)
                            if (conflito){
                                throw new Error('O Equipamento ' + equipamento.nome + ' já está alocado em outro serviço no dia ' + data)
                            }
                            const dadosAlocEquip = {
                                id_servico: novoServico.id,
                                id_equipamento: alocEquip.id_equipamento,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_hora_alocada: alocEquip.valor_hora_alocada
                            }
                            if(dadosAlocEquip.valor_hora_alocada < 0){
                                throw new Error('O valor da hora do equipamento não pode ser negativo')
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
                            if(funcionario.status === "inativo"){
                                throw new Error('Funcionario ' + funcionario.nome + ' está inativo e não pode ser alocado para serviço')
                            }
                            const conflito = await AlocacaoFuncRepo.findByFuncionarioData(alocFunc.id_funcionario, data)
                            if (conflito){
                                throw new Error('O Funcionario ' + funcionario.nome + ' já está alocado em outro serviço no dia ' + data)
                            }

                            const dadosAlocFunc = {
                                id_servico: id,
                                id_funcionario: alocFunc.id_funcionario,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_dia_alocado: alocFunc.valor_dia_alocado
                            }
                            if(dadosAlocFunc.valor_dia_alocado < 0){
                                throw new Error('O valor da diaria do funcionario não pode ser negativo')
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
                            if(equipamento.status === "inativo"){
                                throw new Error('Equipamento: ' + equipamento.nome + "está inaivo e não pode ser alocado para serviço")
                            }
                            const conflito = await AlocacaoEquipRepo.findByEquipamentoData(alocEquip.id_equipamento, data)
                            if (conflito){
                                throw new Error('O Equipamento ' + equipamento.nome + ' já está alocado em outro serviço no dia ' + data)
                            }
                            const dadosAlocEquip = {
                                id_servico: id,
                                id_equipamento: alocEquip.id_equipamento,
                                data: data,
                                hora: horasTrabalhadas,
                                valor_hora_alocada: alocEquip.valor_hora_alocada
                            }
                            if(dadosAlocEquip.valor_hora_alocada < 0){
                                throw new Error('O valor da hora do equipamento não pode ser negativo')
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

            if (dadosServico.data_fim < dadosServico.data_inicio){
                throw new Error('A data final não pode ser anterior a data de inicio')
            }

            if (dadosServico.orcamento < 0){
                throw new Error('O orcamento não pode ser negativo')
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