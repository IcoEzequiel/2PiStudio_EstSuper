const ParametrizacaoEquipamento = require('../models/ModelParametrizacaoEquipamento')

const ParametrizacaoEquipamentoRepository = {
    getAll: async () => {
        return await ParametrizacaoEquipamento.findAll()
    },

    getById: async (id) => {
        return await ParametrizacaoEquipamento.findByPk(id)
    },

    save: async (dados) => {
        return await ParametrizacaoEquipamento.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await ParametrizacaoEquipamento.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await ParametrizacaoEquipamento.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = ParametrizacaoEquipamentoRepository