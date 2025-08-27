const Usuario = require('../models/ModelUsuario')

const UsuarioRepository = {
    getAll: async (options = {}) => {
        return await Usuario.findAll(options)
    },

    getById: async (id, options = {}) => {
        return await Usuario.findByPk(id, options)
    },

    findByLogin: async (login) => {
        return await Usuario.findOne({ where: {login: login}})
    },

    save: async (dados, options = {}) => {
        return await Usuario.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await Usuario.findByPk(id, options)
        if (!arqui) return null
        return await arqui.update(dados, options)
    },

    delete: async (id, options = {}) => {
        const arqui = await Usuario.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = UsuarioRepository