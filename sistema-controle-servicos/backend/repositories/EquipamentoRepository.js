const Equipamento = require('../models/ModelEquipamento')

const EquipamentoRepository = {
    getAll: async () => {
        return await Equipamento.findAll()
    },

    getById: async (id) => {
        return await Equipamento.findByPk(id)
    },

    save: async (dados) => {
        return await Equipamento.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await Equipamento.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await Equipamento.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = EquipamentoRepository