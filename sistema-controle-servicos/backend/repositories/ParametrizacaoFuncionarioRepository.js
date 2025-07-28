const ParametrizacaoFuncionario = require('../models/ModelParametrizacaoFuncionario')

const ParametrizacaoFuncionarioRepository = {
    getAll: async () => {
        return await ParametrizacaoFuncionario.findAll()
    },

    getById: async (id) => {
        return await ParametrizacaoFuncionario.findByPk(id)
    },

    save: async (dados) => {
        return await ParametrizacaoFuncionario.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await ParametrizacaoFuncionario.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await ParametrizacaoFuncionario.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = ParametrizacaoFuncionarioRepository