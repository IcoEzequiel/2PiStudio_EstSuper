const AlocacaoEquipamento = require('../models/ModelAlocacaoEquipamento')

const AlocacaoEquipamentoRepository = {
    getAll: async () => {
        return await AlocacaoEquipamento.findAll()
    },

    getById: async (id) => {
        return await AlocacaoEquipamento.findByPk(id)
    },

    save: async (dados) => {
        return await AlocacaoEquipamento.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await AlocacaoEquipamento.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await AlocacaoEquipamento.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = AlocacaoEquipamentoRepository