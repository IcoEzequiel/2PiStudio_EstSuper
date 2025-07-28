const AlocacaoFuncionario = require('../models/ModelAlocacaoFuncionario')

const AlocacaoFuncionarioRepository = {
    getAll: async () => {
        return await AlocacaoFuncionario.findAll()
    },

    getById: async (id) => {
        return await AlocacaoFuncionario.findByPk(id)
    },

    save: async (dados) => {
        return await AlocacaoFuncionario.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await AlocacaoFuncionario.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await AlocacaoFuncionario.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = AlocacaoFuncionarioRepository