const repo = require('../repositories/AlocacaoFuncionarioRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const FuncionarioRepo = require('../repositories/FuncionarioRepository')
const AlocFuncMapper = require('../mappers/AlocacaoFuncionarioMapper')

// Funcões auxiliares

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
const validar = async (dados, create = false) => {
    if(create){
        const servico = await ServicoRepo.getById(dados.id_servico)
        const funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!servico)
            throw Error('Serviço não existe')
        if (!funcionario)
            throw Error('Funcionario Não existe')
        return true
    } else {
        if(dados.id_funcionario){
        const funcionario = await FuncionarioRepo.getById(dados.id_funcionario)
        if (!funcionario)
            throw Error('Funcionario Não existe')
        }
        if (dados.id_servico){
            const servico = await ServicoRepo.getById(dados.id_servico)
            if (!servico)
                throw Error('Serviço não existe')
        }
    }
}

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include: [
        {model: require('../models/ModelServico'), as: 'servico'},
        {model: require('../models/ModelFuncionario'), as: 'funcionario'}  
    ]}
    // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

// Funções principais

const AlocacaoFuncionarioService = {
    getAll: async () => {
        const AlocFuncs = await getComInclude()
        const AlocFuncsDTO = AlocFuncs.map(A=>AlocFuncMapper.toDTO(A))
        return AlocFuncsDTO
    },

    getById: async (id) => {
        const AlocFunc = await getComInclude(id)
        if(!AlocFunc){
            return null
        }
        const AlocFuncDTO = AlocFuncMapper.toDTO(AlocFunc)
        return AlocFuncDTO
    },

    create: async (dados) => {
        await validar(dados, true)
        const novo = await repo.save(dados)
        const novo2 = await getComInclude(novo.id)
        const novoDTO = AlocFuncMapper.toDTO(novo2)
        return novoDTO
    },

    update: async (id, dados) => {
        await validar(dados)
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