const Cliente  = require('../models/ModelCliente')
const Servico = require('../models/ModelServico')

const ServicoRepository = {
    getAll: async (options = {}) => {
        return await Servico.findAll(options)
    },

    getById: async (id, options = {}) => {
        return await Servico.findByPk(id,options)
    },

    save: async (dados, options = {}) => {
        return await Servico.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await Servico.findByPk(id, options)
        if (!arqui) return null
        return await arqui.update(dados, options)
    },

    delete: async (id, options = {}) => {
        const arqui = await Servico.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true 
    }
}
 
module.exports = ServicoRepository