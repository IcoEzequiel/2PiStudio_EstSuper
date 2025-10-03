const service = require('../services/FeedbackService')

// Responsavel pela conexão, as rotas estão em uma pasta separada
// Todas as validações são necessarias, pos cada uma recebe um "null" do service
const FeedbackController = {
    getAll: async (req, res) => {
        try {
            const Feedbacks = await service.getAll(req.user)
            res.json(Feedbacks)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const Feedback = await service.getById(req.params.id)
            if (!Feedback) return res.status(404).json({ error: "Feedback não encontrado"})
            res.json(Feedback)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    // O crate ficou automatico, too feedback feito pelo usuario agora é um update
    // create: async (req, res) => {
    //     try {
    //         const novo = await service.create(req.body)
    //         res.status(201).json(novo)
    //     } catch (err) {
    //         res.status(400).json({ error: err.message})
    //     }
    // },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body, req.user)
            res.status(200).json(edit)
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