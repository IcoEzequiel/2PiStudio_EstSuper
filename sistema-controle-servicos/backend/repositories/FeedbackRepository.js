const Feedback = require('../models/ModelFeedback')

const FeedbackRepository = {
    getAll: async (options = {}) => {
        return await Feedback.findAll(options)
    },

    getById: async (id, options = {}) => {
        return await Feedback.findByPk(id, options)
    },

    save: async (dados, options = {}) => {
        return await Feedback.create(dados, options)
    },

    update: async (id, dados, options = {}) => {
        const arqui = await Feedback.findByPk(id, options)
        if (!arqui) return null
        return await arqui.update(dados, options)
    },

    delete: async (id, options = {}) => {
        const arqui = await Feedback.findByPk(id, options)
        if (!arqui) return null
        await arqui.destroy(options)
        return true
    }
}
 
module.exports = FeedbackRepository