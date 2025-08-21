const repo = require('../repositories/ParametrizacaoEquipamentoRepository')
const EquipamentoRepo = require('../repositories/EquipamentoRepository')
const ParaEquiMapper = require('../mappers/ParametrizacaoEquipamentoMapper')
const { sequelize } = require('../db'); 

const ParametrizacaoEquipamentoService = {
    getAll: async () => {
        const ParaEquips = await repo.getAll()
        const ParaEquipsDTO = ParaEquips.map(P => ParaEquiMapper.toDTO(P))
        return ParaEquipsDTO
    },

    getById: async (id) => {
        const ParaEquip = await repo.getById(id)
        if(!ParaEquip){
            return null
        }
        const ParaEquipDTO = ParaEquiMapper.toDTO(ParaEquip)
        return ParaEquipDTO
    },

    create: async (dados) => {
        const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
        if (!Equipamento) throw Error("Equipamento Não Existe")
        return await repo.save(dados)
    },

    update: async (id, dados) => {
        const Equipamento = await EquipamentoRepo.getById(dados.id_equipamento)
        if (!Equipamento) throw Error("Equipamento Não Existe")
        return await repo.update(id, dados)
    },

    delete: async (id) => {
        return await repo.delete(id)
    }
}

module.exports = ParametrizacaoEquipamentoService