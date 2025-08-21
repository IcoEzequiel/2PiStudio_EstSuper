const { Funcionario } = require('../models')
const ParametrizacaoFuncionario = require('../models/ModelParametrizacaoFuncionario')

const ParametrizacaoFuncionarioRepository = {
    getAll: async () => {
        return await ParametrizacaoFuncionario.findAll({
            include:[{model: Funcionario, as: 'funcionario'}]
        })
    },

    getById: async (id) => {
        return await ParametrizacaoFuncionario.findByPk(id,{
            include:[{ model: Funcionario, as: 'funcionario'}]
        })
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