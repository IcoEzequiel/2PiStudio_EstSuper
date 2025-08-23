const Equipamento = require('../models/ModelEquipamento')

const EquipamentoRepository = {
    getAll: async (options = {}) => {
        return await Equipamento.findAll(options)
    },

    getById: async (id, options = {}) => {
        return await Equipamento.findByPk(id, options)
    },

    save: async (dados, options = {}) => {
        return await Equipamento.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await Equipamento.findByPk(id, options)
        if (!arqui) return null
        return await arqui.update(dados, options)
    },

    delete: async (id, options = {}) => {
        const arqui = await Equipamento.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = EquipamentoRepository