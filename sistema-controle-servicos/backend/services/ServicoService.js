const { sequelize } = require('../db'); 

// Repositorios para criação, edição e exclusão
const ServicoRepo = require('../repositories/ServicoRepository')
const AlocacaoFuncRepo = require('../repositories/AlocacaoFuncionarioRepository')
const AlocacaoEquipRepo = require('../repositories/AlocacaoEquipamentoRepository')

// Repositorios para validação
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const ClienteRepo = require('../repositories/ClienteRepository')

// Para transformar o os dados em DTOs
const ServicoMapper = require('../mappers/servicoMapper')

// Para calcular o status do serviço, ele vai salvar no backEnd quase todas como agendado,
// mas na hora de mostrar os serviços, transforma conforme a data de hoje. (Se for uma data futura,
// vai ser 'agendado', se for durante a realização do serviço, recebe 'em execução',
// se for uma data passada, recebe "concluido")
const calcularStatus = (servico) => {
    if (servico.status === 'concluido') {
        return 'concluido'
    }
    const hoje = new Date()
    const dataInicio = new Date(servico.data_inicio)
    const dataFim = new Date(servico.data_fim)

    // Elimina as horas para não gerar conflito
    hoje.setHours(0,0,0,0)
    dataInicio.setHours(0,0,0,0)
    dataFim.setHours(0,0,0,0)

    if (hoje > dataFim)
        return 'concluido'
    else if (hoje >= dataInicio && hoje <= dataFim)
        return 'em execução'
    else // hoje < data_inicio
        return 'agendado'
}

const getComInclude = async (id) => {
    const inclusao = {include:[
                {model: require('../models/ModelCliente'), as: 'cliente'}
            ]}
            if(!id)
                return await ServicoRepo.getAll(inclusao)
            else
                return await ServicoRepo.getById(id, inclusao )
}

const validarServico = async (dados) => {
    const cliente = await ClienteRepo.getById(dados.id_cliente)
    if (!cliente){
        throw new Error('Cliente não existe.')
    }
    if (dados.data_fim < dados.data_inicio){
        throw new Error('A data final não pode ser anterior a data de inicio')
    }

    if(dados.orcamento < 0){
        throw new Error('O orcamento não pode ser negativo')
    }
}

const validarFuncionario = async (dados, data) => {
    const funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
    if(!funcionario){
        throw new Error('Funcionario não existe')
    }
    if(funcionario.status === 'inativo'){
        throw new Error('O funcionario ' + funcionario.nome + ' está inativo e não pode ser alocado para serviço')
    }
    const conflito = await AlocacaoFuncRepo.findByFuncionarioData(dados.id_funcionario, data)
    if(conflito){
        throw new Error('O funcionario ' + funcionario.nome + ' já está alocado em outro serviço no dia ' + data)
    }
}   

const validarEquipamento = async (dados, data) => {
    const equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
    if(!equipamento){
        throw new Error('Equipamento não existe')
    }
    if(equipamento.status === 'inativo'){
        throw new Error('Equipmaneto ' + equipamento.nome + ' está inativo e não pode ser alocado para serviço')
    }
    const conflito = await AlocacaoEquipRepo.findByEquipamentoData(dados.id_equipamento, data)
    if (conflito){
        throw new Error('O equipamento ' + equipamento.nome + ' já está alocado em outro serviço no dia ' + data)
    }
}

const gerenciarAlocacoes = async (servicoId, alocacoesDiarias, transaction) => {
    if (!alocacoesDiarias) return

    for (const data in alocacoesDiarias){
        const dia = alocacoesDiarias[data]
        const horasTrabalhadas = dia.horas_trabalhadas

        if (dia.funcionarios){
            for (const alocFunc of dia.funcionarios){
                await validarFuncionario(alocFunc, data)
                const dadosAlocFunc = {
                    id_servico: servicoId,
                    id_funcionario: alocFunc.id_funcionario,
                    data: data,
                    hora: horasTrabalhadas,
                    valor_dia_alocado: alocFunc.valor_dia_alocado
                    }
                await AlocacaoFuncRepo.save(dadosAlocFunc, {transaction})
            }
        }
        if (dia.equipamentos){
            for (const alocEquip of dia.equipamentos){
                await validarEquipamento(alocEquip,data)
                const dadosAlocEquip = {
                    id_servico: servicoId,
                    id_equipamento: alocEquip.id_equipamento,
                    data: data,
                    hora: horasTrabalhadas,
                    valor_hora_alocada: alocEquip.valor_hora_alocada
                    }
                await AlocacaoEquipRepo.save(dadosAlocEquip, {transaction})
            }
        }
    }
}

const ServicoService = {
    getAll: async () => {
        // Transformar em uma Função unica
        const Servicos = await getComInclude()
        const ServicosStatusAtt = Servicos.map(servico => {
            const servicoData = servico
            servicoData.status = calcularStatus(servicoData)
            return servicoData
        })
        // Trasnformar Até Aqui
        const ServicosDTO = ServicosStatusAtt.map(S => ServicoMapper.toDTO(S))
        return ServicosDTO
    },

    getById: async (id) => {
        // Transformar em uma função Unica
        const Servico = await getComInclude(id)
        if (!Servico){
            return null
        }
        const servicoData = Servico
        servicoData.status = calcularStatus(servicoData)

        // Trasformar Até aqui
        const ServicoDTO = ServicoMapper.toDTO(servicoData)
        return ServicoDTO
    },

    create: async (dados) => {
        const t = await sequelize.transaction()
        try {
            // Validação do Cliente e serviço
            await validarServico(dados)

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
            await gerenciarAlocacoes(novoServico.id, dados.alocacoes_diarias, t)
            await t.commit()
            const servicoCompleto = await getComInclude(novoServico.id)
            const novoServicoDTO = ServicoMapper.toDTO(servicoCompleto)
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
            // Juntar com a outra validação e criar um sistema para diferenciar se é update ou create
            await validarServico(dados)
            // Valiação Serviço
            const servico = await ServicoRepo.getById(id, {
                include: [
                    { model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'},
                    { model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoesEquipamento'}
                ], 
                transaction: t
            })

            // Apaga todas as alocações para depois recriar
            for(const aloc of servico.alocacoesFuncionario || []){
                await AlocacaoFuncRepo.delete(aloc.id, {transaction: t})
            }
            for(const aloc of servico.alocacoesEquipamento || []){
                await AlocacaoEquipRepo.delete(aloc.id, {transaction: t})
            }

            // Recriação das alocações
            await gerenciarAlocacoes(id, dados.alocacoes_diarias, t)

            const dadosServico = {
                id_cliente: dados.id_cliente,
                nome: dados.nome, 
                descricao: dados.descricao,
                data_inicio: dados.data_inicio,
                data_fim: dados.data_fim,
                status: dados.status,
                orcamento: dados.orcamento
            }

            const servicoEdit = await ServicoRepo.update(id, dadosServico, t)

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