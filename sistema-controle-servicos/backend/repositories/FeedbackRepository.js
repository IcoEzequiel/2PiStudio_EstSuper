const Servico = require('../models/ModelServico')
const Funcionario = require('../models/ModelFuncionario')
const Feedback = require('../models/ModelFeedback')

const FeedbackRepository = {
    getAll: async () => {
        return await Feedback.findAll({
            include:[{model: Servico, as: 'servico'},
                    {model: Funcionario, as: 'funcionario'}
            ]
        })
    },

    getById: async (id) => {
        return await Feedback.findByPk(id,{
            include:[{model: Servico, as: 'servico'},
                    {model: Funcionario, as: 'funcionario'}
            ]
        })
    },

    save: async (dados) => {
        return await Feedback.create(dados)
    },

    update: async (id, dados) => {
        const arqui = await Feedback.findByPk(id)
        if (!arqui) return null
        return await arqui.update(dados)
    },

    delete: async (id) => {
        const arqui = await Feedback.findByPk(id)
        if (!arqui) return null
        await arqui.destroy()
        return true
    }
}
 
module.exports = FeedbackRepository