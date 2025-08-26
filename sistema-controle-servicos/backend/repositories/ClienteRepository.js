const Cliente = require('../models/ModelCliente');

const ClienteRepository = {
    getAll: async (options = {}) => {
        return await Cliente.findAll(options);
    },

    getById: async (id, options = {}) => {
        return await Cliente.findByPk(id, options);
    },

    save: async (dados, options = {}) => {
        return await Cliente.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const cliente = await Cliente.findByPk(id, options)
        if (!cliente) return null
        return await cliente.update(dados,options)
    },

    delete: async (id, options = {}) => {
        const cliente = await Cliente.findByPk(id, options)
        if (!cliente) return null
        await cliente.destroy(options)
        return true
    }
}

module.exports = ClienteRepository