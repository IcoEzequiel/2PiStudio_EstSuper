const repo = require('../repositories/ParametrizacaoEquipamentoRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const ParaEquiMapper = require('../mappers/ParametrizacaoEquipamentoMapper')

const getComInclude = async (id) => {
    const inclusao = {include:[
        {model: require('../models/ModelEquipamento'), as: 'equipamento'}
    ]}
    if(!id)
        return repo.getAll(inclusao)
    else
        return repo.getById(id, inclusao)
}

const validar = async (dados) => {
    const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
    if (!Equipamento)
        throw Error('Equipamento Não Existe')
    return true
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
        await validar(dados)
        const novo = await repo.save(dados)
        const novoDTO = ParaEquiMapper.toDTO(novo)
        return novoDTO
    },

    update: async (id, dados) => {
        await validar(dados)
        const edit = await repo.update(id,dados)
        if(!edit){
            return null
        }
        const editDTO = ParaEquiMapper.toDTO(edit)
        return editDTO
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ParametrizacaoEquipamentoService