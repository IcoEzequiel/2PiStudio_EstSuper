const ParametrizacaoFuncionario = require('../models/ModelParametrizacaoFuncionario')

// Ligação com o repository,se precisar criar uma consulta diferente, adicione ela abaixo.
const ParametrizacaoFuncionarioRepository = {
    getAll: async (options = {}) => {
        return await ParametrizacaoFuncionario.findAll(options)
    },

    getById: async (id, options = {}) => {
        return await ParametrizacaoFuncionario.findByPk(id, options)
    },

    // Com opção options para poder criar um funcionario e sua parametrização ao mesmo tempo
    save: async (dados, options = {}) => {
        return await ParametrizacaoFuncionario.create(dados,options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await ParametrizacaoFuncionario.findByPk(id,options)
        if (!arqui) return null
        return await arqui.update(dados,options)
    },

    delete: async (id, options = {}) => {
        const arqui = await ParametrizacaoFuncionario.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = ParametrizacaoFuncionarioRepository