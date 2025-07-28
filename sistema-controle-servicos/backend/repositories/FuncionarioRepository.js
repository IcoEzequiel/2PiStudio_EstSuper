const Funcionario = require('../models/ModelFuncionario')

const FuncionarioRepository = {
    getAll: async () => {
        return await Funcionario.findAll()
    },

    getById: async (id) => {
        return await Funcionario.findByPk(id)
    },

    save: async (dados) => {
        return await Funcionario.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await Funcionario.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await Funcionario.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = FuncionarioRepository