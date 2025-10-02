const { sequelize } = require('../db');
const { Op, where } = require('sequelize')

// Repositorios para criação, edição e exclusão
const ServicoRepo = require('../repositories/ServicoRepository')
const AlocacaoFuncRepo = require('../repositories/AlocacaoFuncionarioRepository')
const AlocacaoEquipRepo = require('../repositories/AlocacaoEquipamentoRepository')
const FeedbackRepo = require('../repositories/FeedbackRepository')

// Repositorios para validação
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const ClienteRepo = require('../repositories/ClienteRepository')

// Para transformar o os dados em DTOs
const ServicoMapper = require('../mappers/servicoMapper')

// ** FUNÇÕES AUXILIARES

//Calcula o Lucro do Servico
const calcularLucriEstimado = (servico) => {
    const orcamento = parseFloat(servico.orcamento) || 0;
    let custoTotal = 0

    //Calculo do valor dos funcionarios
    if (servico.alocacoesFuncionario && Array.isArray(servico.alocacoesFuncionario)){
        for (const aloc of servico.alocacoesFuncionario){
            const valor = parseFloat(aloc.valor_dia_alocado) || 0
            const horas = parseInt(aloc.hora) || 0
            custoTotal += valor * horas
        }
    }
    if (servico.alocacoesEquipamento && Array.isArray(servico.alocacoesEquipamento)){
        for (const aloc of servico.alocacoesEquipamento){
            const valor = parseFloat(aloc.valor_hora_alocada) || 0
            const horas = parseInt(aloc.hora) || 0
            custoTotal += valor * horas
        }
    }

    return orcamento - custoTotal;
}



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

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
                { model: require('../models/ModelCliente'), as: 'cliente'},
                { model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoesEquipamento'},
                { model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'}
            ]}
            // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
            if(!id)
                return await ServicoRepo.getAll(inclusao)
            else
                return await ServicoRepo.getById(id, inclusao )
}

// Valida do serviço.
const validarServico = async (dados,id = null) => {
    if(!id){
        const cliente = await ClienteRepo.getById(dados.id_cliente)
        // Verifica se o cliente existe
        if (!cliente){
            throw new Error('Cliente não existe.')
        }
        // Verifica se a data final não ocorre antes da data inicial
        if (dados.data_fim < dados.data_inicio){
            throw new Error('A data final não pode ser anterior a data de inicio')
        }
        // Verifica se o orcamento não é negativo
        if(dados.orcamento < 0){
            throw new Error('O orcamento não pode ser negativo')
    }
    } else {
        const servico = await getComInclude(id)
        if(!servico)
            throw new Error('Servico não existe')
        if(dados.id_cliente){
            const cliente = await ClienteRepo.getById(dados.id_cliente)
            // Verifica se o cliente existe
            if (!cliente){
                throw new Error('Cliente não existe.')
            }
        }
        if(dados.data_inicio && dados.data_fim){
            if(dados.data_fim < dados.data_inicio)
                throw new Error("A data Final não pode ser anterior a data de inicio")
        if(dados.data_fim && servico.data_inicio){
            if(dados.data_fim < servico.data_inicio)
                throw new Error("A data Final não pode ser anterior a data de inicio") 
        }
        if(dados.data_inicio && servico.data_fim){
            if(servico.data_fim < dados.data_inicio)
                throw new Error("A data Final não pode ser anterior a data de inicio")
        }
        }

        if(dados.orcamento && dados.orcamento < 0)
                throw new Error('O orcamento não pode ser negativo')
    }
}
// Validação do funcionario. (A data é para saber se ele já está alocado nesse dia)
const validarFuncionario = async (dados, data) => {
    const funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
    // Verifica se o funcionario existe
    if(!funcionario){
        throw new Error('Funcionario não existe')
    }
    // Verifica se ele está inativo ('Inativo' = 'Deletado')
    if(funcionario.status === 'inativo'){
        throw new Error('O funcionario ' + funcionario.nome + ' está inativo e não pode ser alocado para serviço')
    }
    //Comentado pos pode haver alocações para o mesmo dia

    // Verifica se esse funcionari já não está alocado em outro serviço nesta mesma data.
    // const conflito = await AlocacaoFuncRepo.findByFuncionarioData(dados.id_funcionario, data)
    // if(conflito){
    //     throw new Error('O funcionario ' + funcionario.nome + ' já está alocado em outro serviço no dia ' + data)
    // }
}   

// Validação de Equipamento
const validarEquipamento = async (dados, data) => {
    const equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
    // Verifica se o equipamento existe.
    if(!equipamento){
        throw new Error('Equipamento não existe')
    }
    // Verifica se ele está inativo. ('inativo' = deletado)
    if(equipamento.status === 'inativo'){
        throw new Error('Equipmaneto ' + equipamento.nome + ' está inativo e não pode ser alocado para serviço')
    }
    //Comentado pos pode haver alocações para o mesmo dia

    // Verifica se ele não está alocado em outro serviço na mesma data
    // const conflito = await AlocacaoEquipRepo.findByEquipamentoData(dados.id_equipamento, data)
    // if (conflito){
    //     throw new Error('O equipamento ' + equipamento.nome + ' já está alocado em outro serviço no dia ' + data)
    // }
}

// Funcção auxiliar para gerenciar as alocações, criando elas com os dados fornecidos
const gerenciarAlocacoes = async (servicoId, alocacoesDiarias, transaction) => {
    // verifica se veio alguma alocação
    if (!alocacoesDiarias) return

    // Usado para a criação de um feedback por funcionario por serviço
    const funcionariosComFeedback = new Set()

    // Looping com as datas que o serviço vai ser prestado
    for (const data in alocacoesDiarias){
        const dia = alocacoesDiarias[data]
        const horasTrabalhadas = dia.horas_trabalhadas

        // Lopping dos funcionarios alocados para esse dia
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
                const novaAlocacao = await AlocacaoFuncRepo.save(dadosAlocFunc, {transaction})

                // Logica do FeedBack Unico por Funcionario
                const funcionarioId = alocFunc.id_funcionario
                if (!funcionariosComFeedback.has(funcionarioId)){
                    await FeedbackRepo.save({id_alocacaoFuncionario: novaAlocacao.id}, {transaction})
                    funcionariosComFeedback.add(funcionarioId)
                }
            }
        }
        // Looping dos equipamentos alocados para esse dia
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

// ** FUNÇÕES PRINCIPAIS **

const ServicoService = {
    getAll: async (usuario) => {
        //Logica para a separação de get servico para cliente e para administrador
        const options = {
            include: [
                { model: require('../models/ModelCliente'), as: 'cliente'},
                { model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoesEquipamento'},
                { model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'}
            ]
        }
        // Filtragem
        if (usuario.papel && usuario.papel === 'funcionario'){
            options.include.find( inc => inc.as === 'alocacoesFuncionario').where = {
                id_funcionario: usuario.id_funcionario
            }
              options.include.find(inc => inc.as === 'alocacoesFuncionario').require = true; 
        }
        const Servicos = await ServicoRepo.getAll(options)

        const ServicosStatusAtt = Servicos.map(servico => {
            servico.dataValues.status = calcularStatus(servico)
            servico.dataValues.lucro_estimado = calcularLucriEstimado(servico)
            return servico
        })
        const ServicosDTO = ServicosStatusAtt.map(S => ServicoMapper.toDTO(S))
        return ServicosDTO
    },

    getById: async (id,usuario) => {
        const Servico = await getComInclude(id)
        if (!Servico){
            return null
        }
        //Logica para a separação de get servico para cliente e para administrador
        if (usuario.papel === 'funcionario'){
            const alocacoes = await AlocacaoFuncRepo.getAll({
                where: {
                    id_servico: id,
                    id_funcionario: usuario.id_funcionario
                }
            })

            // Se não achar a o serviço, ou não existe ou não tem permição para ver
            if(!alocacoes || alocacoes.length === 0) {
                return null;
            }
        }
        Servico.dataValues.status = calcularStatus(Servico)
        Servico.dataValues.lucro_estimado = calcularLucriEstimado(Servico)

        const ServicoDTO = ServicoMapper.toDTO(Servico)
        return ServicoDTO
    },

    create: async (dados) => {
        const t = await sequelize.transaction()
        try {
            await validarServico(dados)

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
            await validarServico(dados,id)
            // Pega o serviço com suas alocações
            const servico = await ServicoRepo.getById(id, {
                include: [
                    { model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'},
                    { model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoesEquipamento'}
                ], 
                transaction: t
            })

            // Apaga todas as alocações para depois recriar
            if(servico.alocacoesFuncionario){
                for(const aloc of servico.alocacoesFuncionario || []){
                    await AlocacaoFuncRepo.delete(aloc.id, {transaction: t})
                }
            }
            if(servico.alocacoesEquipamento){
                for(const aloc of servico.alocacoesEquipamento || []){
                    await AlocacaoEquipRepo.delete(aloc.id, {transaction: t})
                }
            }

            // Recriação das alocações
            if(dados.alocacoes_diarias)
                await gerenciarAlocacoes(id, dados.alocacoes_diarias,t)

            const dadosServico = {
                ...servico.get({plain: true}),
                ...dados
            }
            await ServicoRepo.update(id, dadosServico, {transaction: t})
            await t.commit()
            const servicoedit = await getComInclude(id)
            const servicoEditDTO = ServicoMapper.toDTO(servicoedit)
            return servicoEditDTO
        } catch(error){
            await t.rollback()
            console.error('Erro detalhado ao atualizar o serviço: ', error)
            throw new Error('Erro ao atualizar serviço: ' + error.message)
        }
    },

    delete: async (id) => {
        const t = await sequelize.transaction()

        try {
            // Pega o serviço com suas alocações
            const servico = await ServicoRepo.getById(id, {
                include: [
                    {model: require('../models/ModelAlocacaoFuncionario'), as: 'alocacoesFuncionario'},
                    {model: require('../models/ModelAlocacaoEquipamento'), as: 'alocacoesEquipamento'}
                ],
                transaction: t
            })
            // Deleta as alocações
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