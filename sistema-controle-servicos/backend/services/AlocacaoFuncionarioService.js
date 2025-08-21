const repo = require('../repositories/AlocacaoFuncionarioRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const AlocFuncMapper = require('../mappers/AlocacaoFuncionarioMapper')
const { sequelize } = require('../db'); 

const AlocacaoFuncionarioService = {
    getAll: async () => {
        const AlocFuncs = await repo.getAll()
        const AlocFuncsDTO = AlocFuncs.map(A=>AlocFuncMapper.toDTO(A))
        return AlocFuncsDTO
    },

    getById: async (id) => {
        const AlocFunc = await repo.getById(id)
        if(!AlocFunc){
            return null
        }
        const AlocFuncDTO = AlocFuncMapper.toDTO(AlocFunc)
        return AlocFuncDTO
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
        const novoDTO = AlocFuncMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        const Servico = await ServicoRepo.getById(dados.id_servico)
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Servico){
            throw Error("Serviço Não Existe")
        }    
        if (!Funcionario){
            throw Error("Fucionario Não Existe")
        } 
        const edit = await repo.update(id,dados)
        if(!edit){
            return null
        }
        const editDTO = AlocFuncMapper.toDTO(edit)
        return editDTO 
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = AlocacaoFuncionarioService