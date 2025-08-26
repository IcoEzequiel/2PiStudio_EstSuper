const repo = require('../repositories/FeedbackRepository')
const AlocFuncRepo = require('../repositories/AlocacaoFuncionarioRepository')
const FeedbackMapper = require('../mappers/FeedbackMapper')
const { sequelize } = require('../db'); 

const FeedbackService = {
    getAll: async () => {
        const Feedbacks = await repo.getAll({
            include:[{model: require('../models/ModelAlocacaoFuncionario'), as: 'servicoPrestado'}]
        })
        const FeedbacksDTO = Feedbacks.map(F => FeedbackMapper.toDTO(F))
        return FeedbacksDTO
    },

    getById: async (id) => {
        const Feedback = await repo.getById(id,{
            include:[{model: require('../models/ModelAlocacaoFuncionario'), as: 'servicoPrestado'}]
        })
        if(!Feedback){
            return null
        }
        const FeedbackDTO = FeedbackMapper.toDTO(Feedback)
        return FeedbackDTO
    },

    create: async (dados) => {
        const ServicoPrestado = await AlocFuncRepo.getById(dados.id_alocacaoFuncionario)
        if (!ServicoPrestado){
            throw new Error('Serviço Prestado Inexistente')
        }
        const novo = await repo.save(dados)
        const novoDTO = FeedbackMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        const ServicoPrestado = await AlocFuncRepo.getById(dados.id_alocacaoFuncionario)
        if (!ServicoPrestado){
            throw new Error('Serviço Prestado Inexistente')
        }
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