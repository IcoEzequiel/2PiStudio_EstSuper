const repo = require('../repositories/ParametrizacaoFuncionarioRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const ParaFuncMapper = require('../mappers/ParametrizacaoFuncionarioMapper')

const getComInclude = async (id) => {
    const inclusao = {include:[
        {model: require('../models/ModelFuncionario'), as: 'funcionario'}
    ]}
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

const validar = async (dados) => {
    const Funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
    if (!Funcionario)
        throw Error('Funcionario Não Existe')
    return true
}

const ParametrizacaoFuncionarioService = {
    getAll: async () => {
        const ParaFuncs = await getComInclude()
        const ParaFuncsDTO = ParaFuncs.map(P => ParaFuncMapper.toDTO(P))
        return ParaFuncsDTO
    },

    getById: async (id) => {
        const ParaFunc = await getComInclude(id)
        if (!ParaFunc){
            return null
        }
        const ParaFuncDTO = ParaFuncMapper.toDTO(ParaFunc)
        return ParaFuncDTO
    },

    create: async (dados) => {
        await validar(dados)
        const novo = await repo.save(dados)
        const novoDTO = ParaFuncMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        await validar(dados)
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