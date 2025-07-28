const Feedback = require('../models/ModelFeedback')

const FeedbackRepository = {
    getAll: async () => {
        return await Feedback.findAll()
    },

    getById: async (id) => {
        return await Feedback.findByPk(id)
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