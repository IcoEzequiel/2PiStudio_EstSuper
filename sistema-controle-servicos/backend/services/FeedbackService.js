const repo = require('../repositories/FeedbackRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const FeedbackMapper = require('../mappers/FeedbackMapper')
const { sequelize } = require('../db'); 

const FeedbackService = {
    getAll: async () => {
        const Feedbacks = await repo.getAll()
        const FeedbacksDTO = Feedbacks.map(F => FeedbackMapper.toDTO(F))
        return FeedbacksDTO
    },

    getById: async (id) => {
        const Feedback = await repo.getById(id)
        if(!Feedback){
            return null
        }
        const FeedbackDTO = FeedbackMapper.toDTO(Feedback)
        return FeedbackDTO
    },

    create: async (dados) => {
        const Servico = await ServicoRepo.getById(dados.id_servico)
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Servico){
            throw Error("Serviço Não Existe")
        }    
        if (!Funcionario){
            throw Error("Fucionario Não Existe")
        } 
        const novo = await repo.save(dados)
        const novoDTO = FeedbackMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        const Servico = await ServicoRepo.getById(dados.id_servico)
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Servico){
            throw new Error("Serviço Não Existe");
        }    
        if (!Funcionario){
            throw new Error("Fucionario Não Existe");
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