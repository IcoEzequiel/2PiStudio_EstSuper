const AlocacaoFuncionario = require('../models/ModelAlocacaoFuncionario')
const Servico = require('../models/ModelServico')
const Funcionario = require('../models/ModelFuncionario')

const AlocacaoFuncionarioRepository = {
    getAll: async () => {
        return await AlocacaoFuncionario.findAll({
            include:[{model: Servico, as:'servico'},
                {model: Funcionario, as:'funcionario'}
            ]
        })
    },

    getById: async (id) => {
        return await AlocacaoFuncionario.findByPk(id,{
            include:[{model: Servico, as:'servico'},
                {model: Funcionario, as:'funcionario'}
            ]
        })
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