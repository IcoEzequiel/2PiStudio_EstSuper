const repo = require('../repositories/FeedbackRepository')
const AlocFuncRepo = require('../repositories/AlocacaoFuncionarioRepository')
const FeedbackMapper = require('../mappers/FeedbackMapper')

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
const validar = async (dados) => {
    const servicoPrestado = await AlocFuncRepo.getById(dados.id_alocacaoFuncionario)
    if (!servicoPrestado){
        throw new Error('Serviço prestado inexistente')
    }
    return true
}

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
        {model: require('../models/ModelAlocacaoFuncionario'), as: 'servicoPrestado'}        
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
        await validar(dados)
        const novo = await repo.save(dados)
        const novoDTO = FeedbackMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        await validar(dados)
        const edit = await repo.update(id, dados)
        if(!edit){
            return null
        }
        const editDTO = FeedbackMapper.toDTO(edit)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = FeedbackService