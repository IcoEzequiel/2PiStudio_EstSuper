const Usuario = require('../models/ModelUsuario')

const UsuarioRepository = {
    getAll: async () => {
        return await Usuario.findAll()
    },

    getById: async (id) => {
        return await Usuario.findByPk(id)
    },

    save: async (dados) => {
        return await Usuario.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await Usuario.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await Usuario.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = UsuarioRepository