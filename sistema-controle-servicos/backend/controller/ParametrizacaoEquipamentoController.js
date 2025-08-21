const service = require('../services/ParametrizacaoEquipamentoService')

const ParametrizacaoEquipamentoController = {
    getAll: async (req, res) => {
        try {
            const ParaEquips = await service.getAll()
            res.json(ParaEquips)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const ParaEquip = await service.getById(req.params.id)
            if (!ParaEquip) return res.status(404).json({ error: "Parametrização não encontrado"})
            res.json(ParaEquip)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            res.status(201).json(novo)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            if (!edit) return res.status(404).json({ error: 'Parametrização não encontrado'})
            res.json(edit)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    delete: async (req, res) => {
        try {
            const dell = await service.delete(req.params.id)
            if (!dell) return res.status(404).json({ error: 'Parametrização não encontrado'})
            res.status(204).end()
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = ParametrizacaoEquipamentoController