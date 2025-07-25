const Cliente = require('../models/ModelCliente');

const ClienteRepository = {
    getAll: async () => {
        return await Cliente.findAll();
    },

    getById: async (id) => {
        return await Cliente.findByPk(id);
    },

    save: async (dados) => {
        return await Cliente.create(dados)
    },

    update: async (id, dados) => {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) return null
        return await cliente.update(dados)
    },

    delete: async (id) => {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) return null
        await cliente.destroy()
        return true
    }
}

module.exports = ClienteRepository