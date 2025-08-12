const service = require('../services/FeedbackService')
const FeedbackMapper = require('../mappers/FeedbackMapper')

const FeedbackController = {
    getAll: async (req, res) => {
        try {
            const Feedbacks = await service.getAll()
            const FeedbacksDTO = Feedbacks.map(f => FeedbackMapper.toDTO(f))
            res.json(FeedbacksDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const Feedback = await service.getById(req.params.id)
            if (!Feedback) return res.status(404).json({ error: "Feedback não encontrado"})
            const FeedbackDTO = FeedbackMapper.toDTO(Feedback)
            res.json(FeedbackDTO)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            const novoDTO = FeedbackMapper.toDTO(novo)
            res.status(201).json(novoDTO)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            if (!edit) return res.status(404).json({ error: 'Serviço não encontrado'})
            const editDTO = FeedbackMapper.toDTO(edit)
            res.json(editDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    delete: async (req, res) => {
        try {
            const dell = await service.delete(req.params.id)
            if (!dell) return res.status(404).json({ error: 'Serviço não encontrado'})
            res.status(204).end()
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = FeedbackController