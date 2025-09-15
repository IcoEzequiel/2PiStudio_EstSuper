const repo = require('../repositories/FeedbackRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const AlocFuncRepo = require('../repositories/AlocacaoFuncionarioRepository')
const FeedbackMapper = require('../mappers/FeedbackMapper')
const { calcularStatus } = require('./ServicoService')

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
const validar = async (dados, create = false) => {
    if(create){
        const servicoPrestado = await AlocFuncRepo.getById(dados.id_alocacaoFuncionario)
        if (!servicoPrestado){
            throw new Error('Serviço prestado inexistente')
        }
        return true
    } else {
        if(dados.servicoPrestado){
            const servicoPrestado = await AlocFuncRepo.getById(dados.id_alocacaoFuncionario)
            if (!servicoPrestado){
                throw new Error('Serviço prestado inexistente')
            }
        }
    }
}
// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
        {model: require('../models/ModelAlocacaoFuncionario'), as: 'servicoPrestado',
            include: [
                {model: require('../models/ModelFuncionario'), as: 'funcionario'},
                {model: require('../models/ModelServico'), as: 'servico'}
            ]
        }        
    ]}
    // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

// Função principal do feedback
const FeedbackService = {
    getAll: async () => {
        const Feedbacks = await getComInclude()
        const FeedbacksDTO = Feedbacks.map(F => FeedbackMapper.toDTO(F))
        return FeedbacksDTO
    },

    getById: async (id) => {
        const Feedback = await getComInclude(id)
        if(!Feedback){
            return null
        }
        const FeedbackDTO = FeedbackMapper.toDTO(Feedback)
        return FeedbackDTO
    },

    create: async (dados) => {
        await validar(dados,true)
        const novo = await repo.save(dados)
        const novo2 = await getComInclude(novo.id)
        const novoDTO = FeedbackMapper.toDTO(novo2)
        return novoDTO
    },

    update: async (id, dados) => {
        if (!dados.comentario || dados.comentario.trim() === ''){
            throw new Error('O comentário não pode estar vazio.')
        }
        const feedback = await repo.getById(id, {
            include: [{
                model: require('../models/ModelAlocacaoFuncionario'), as: 'servicoPrestado'
            }]
        })
        if(!feedback){
            throw new Error('Feedback não existe')
        }
        // Verifica o status do serviço, so pode dar update se o serviço está em execução ou concluido
        const servico = await ServicoRepo.getById(feedback.servicoPrestado.id_servico)
        const statusServico = calcularStatus(servico)

        if(statusServico === 'agendado'){
            throw new Error('Não é possivel enviar feedback para um serviço que não começou')
        }

        const dadosUpdate = {
            comentario: dados.comentario,
            data: new Date(),
            status: 'respondido'
        }

        const edit = await repo.update(id, dadosUpdate)

        const edit2 = await getComInclude(edit.id)
        const editDTO = FeedbackMapper.toDTO(edit2)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = FeedbackService