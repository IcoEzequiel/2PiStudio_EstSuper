const repo = require('../repositories/ParametrizacaoEquipamentoRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const ParaEquiMapper = require('../mappers/ParametrizacaoEquipamentoMapper')

// Funcões auxiliares

// Usado para incluir outros objetos ao principal, esses objetos tem que estár realionados no aquivo server.js
const getComInclude = async (id) => {
    // Determina quais objetos vão ser inclusos no objeto principal
    const inclusao = {include:[
        {model: require('../models/ModelEquipamento'), as: 'equipamento'}
    ]}
    // realiza a requisição para o banco de dados com o as inclusões, o repositorio precisa aceitar um "options" para funcionar
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

// Valida os dados fornecido, usado no create e update para saber se o objeto do ID existe
const validar = async (dados, create = false) => {
    if(create){
        const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
        if (!Equipamento)
            throw Error('Equipamento Não Existe')
        return true
    } else {
        if(dados.id_equipamento){
            const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
            if (!Equipamento)
                throw Error('Equipamento Não Existe')
        }
    }
}

const ParametrizacaoEquipamentoService = {
    getAll: async () => {
        const ParaEquips = await getComInclude()
        const ParaEquipsDTO = ParaEquips.map(P => ParaEquiMapper.toDTO(P))
        return ParaEquipsDTO
    },

    getById: async (id) => {
        const ParaEquip = await getComInclude(id)
        if(!ParaEquip){
            return null
        }
        const ParaEquipDTO = ParaEquiMapper.toDTO(ParaEquip)
        return ParaEquipDTO
    },

    create: async (dados) => {
        await validar(dados,true)
        const novo = await repo.save(dados)
        const novo2 = await getComInclude(novo.id)
        const novoDTO = ParaEquiMapper.toDTO(novo2)
        return novoDTO
    },

    update: async (id, dados) => {
        await validar(dados)
        const edit = await repo.update(id,dados)
        if(!edit){
            return null
        }
        const edit2 = await getComInclude(edit.id)
        const editDTO = ParaEquiMapper.toDTO(edit2)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ParametrizacaoEquipamentoService