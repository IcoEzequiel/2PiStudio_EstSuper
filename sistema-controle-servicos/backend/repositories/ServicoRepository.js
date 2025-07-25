const Servico = require('../models/ModelServico')

const ServicoRepository = {
    getAll: async () => {
        return await Servico.findAll()
    },

    getById: async (id) => {
        return await Servico.findByPk(id)
    },

    save: async (dados) => {
        return await Servico.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await Servico.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await Servico.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = ServicoRepository