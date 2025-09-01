const repo = require('../repositories/FeedbackRepository')
const AlocFuncRepo = require('../repositories/AlocacaoFuncionarioRepository')
const FeedbackMapper = require('../mappers/FeedbackMapper')

const validar = async (dados) => {
    const servicoPrestado = await AlocFuncRepo.getById(dados.id_alocacaoFuncionario)
    if (!servicoPrestado){
        throw new Error('Serviço prestado inexistente')
    }
    return true
}

const getComInclude = async (id) => {
    const inclusao = {include:[
        {model: require('../models/ModelAlocacaoFuncionario'), as: 'servicoPrestado'}        
    ]}
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

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