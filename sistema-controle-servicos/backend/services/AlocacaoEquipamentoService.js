const repo = require('../repositories/AlocacaoEquipamentoRepository')
const ServicoRepo = require('../repositories/ServicoRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const AlocEquipMapper = require('../mappers/AlocacaoEquipamentoMapper')

// Funcões auxiliares

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
const validar = async (dados) => {
    const Servico = await ServicoRepo.getById(dados.id_servico)
    const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
    if (!Servico)
        throw Error("Serviço Não Existe")   
    if (!Equipamento)
        throw Error("Equipamento Não Existe")
    return true
}

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
        {model: require('../models/ModelServico'), as: 'servico'},
        {model: require('../models/ModelEquipamento'), as: 'equipamento'}
    ]}
    // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id,inclusao)
}

// Funções principais

const AlocacaoEquipamentoService = {
    getAll: async () => {
        const AlocEquips = await getComInclude()
        const AlocEquipsDTO = AlocEquips.map(A=> AlocEquipMapper.toDTO(A))
        return AlocEquipsDTO
    },

    getById: async (id) => {
        const AlocEquip = await getComInclude(id)
        if(!AlocEquip) {
            return null
        }
        const AlocEquipDTO = AlocEquipMapper.toDTO(AlocEquip)
        return AlocEquipDTO
    },

    create: async (dados) => {
        await validar(dados)
        const novo = await repo.save(dados)
        const novoDTO = AlocEquipMapper.toDTO(novo)
        return novoDTO  
    },

    update: async (id, dados) => {
        await validar(dados)
        const edit = await repo.update(id,dados)
        if(!edit){
            return null
        }
        const editDTO = AlocEquipMapper.toDTO(edit)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = AlocacaoEquipamentoService