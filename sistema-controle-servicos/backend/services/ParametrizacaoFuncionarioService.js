const repo = require('../repositories/ParametrizacaoFuncionarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const ParaFuncMapper = require('../mappers/ParametrizacaoFuncionarioMapper')
const { sequelize } = require('../db'); 

const ParametrizacaoFuncionarioService = {
    getAll: async () => {
        const ParaFuncs = await repo.getAll()
        const ParaFuncsDTO = ParaFuncs.map(P => ParaFuncMapper.toDTO(P))
        return ParaFuncsDTO
    },

    getById: async (id) => {
        const ParaFunc = await repo.getById(id)
        if (!ParaFunc){
            return null
        }
        const ParaFuncDTO = ParaFuncMapper.toDTO(ParaFunc)
        return ParaFuncDTO
    },

    create: async (dados) => {
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Funcionario) throw Error("Equipamento Não Existe")
        const novo = await repo.save(dados)
        const novoDTO = ParaFuncMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!Funcionario) throw Error("Equipamento Não Existe")
        const edit = await repo.update(id,dados)
        if (!edit){
            null
        }
        const editDTO = ParaFuncMapper.toDTO(edit)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ParametrizacaoFuncionarioService