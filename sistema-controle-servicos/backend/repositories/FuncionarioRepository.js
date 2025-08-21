const Funcionario = require('../models/ModelFuncionario')

const FuncionarioRepository = {
    getAll: async (options = {}) => {
        return await Funcionario.findAll(options)
    },

    /// Options usado para quando for editar, pegar a parametrização
    getById: async (id, options = {}) => {
        return await Funcionario.findByPk(id, options)
    },

    // O options permite que, uma requizição que envie também uma parametrização
    // seja salva apenas quando as duas estiverem ok, evitendo inconsistencia de dados.
    save: async (dados, options = {}) => {
        return await Funcionario.create(dados, options)
    },

    // Options: poder editar e pegar a parametrização
    update: async (id, dados, options= {}) => {
        const arqui = await Funcionario.findByPk(id,options)
        if (!arqui) return null
        return await arqui.update(dados, options)
    },

    delete: async (id, options= {}) => {
        const arqui = await Funcionario.findByPk(id,options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = FuncionarioRepository