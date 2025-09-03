const AlocacaoFuncionario = require('../models/ModelAlocacaoFuncionario')

// Ligação com o repository,se precisar criar uma consulta diferente, adicione ela abaixo.
const AlocacaoFuncionarioRepository = {
    getAll: async (options = {}) => {
        return await AlocacaoFuncionario.findAll(options)
    },

    getById: async (id, options = {}) => {
        return await AlocacaoFuncionario.findByPk(id, options)
    },

    findByFuncionarioData: async (id_funcionario, data, options = {}) => {
        return await AlocacaoFuncionario.findOne({
            where: {
                id_funcionario: id_funcionario,
                data: data
            }
        }, options)
    },

    save: async (dados, options = {}) => {
        return await AlocacaoFuncionario.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await AlocacaoFuncionario.findByPk(id, options)
        if (!arqui) return null
        return await arqui.update(dados, options)
    },

    delete: async (id, options = {}) => {
        const arqui = await AlocacaoFuncionario.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = AlocacaoFuncionarioRepository