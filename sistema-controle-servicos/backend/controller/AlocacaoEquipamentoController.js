const service = require('../services/AlocacaoEquipamentoService')
const AlocacaoEquipamentoMapper = require('../mappers/AlocacaoEquipamentoMapper')

const AlocacaoEquipamentoController = {
    getAll: async (req, res) => {
        try {
            const AlocacaoEquipamentos = await service.getAll()
            const AlocEquipDTO = AlocacaoEquipamentos.map(a => AlocacaoEquipamentoMapper.toDTO(a))
            res.json(AlocEquipDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const AlocacaoEquipamento = await service.getById(req.params.id)
            if (!AlocacaoEquipamento) return res.status(404).json({ error: "Alocação não encontrado"})
            const AlocEquipDTO = AlocacaoEquipamentoMapper.toDTO(AlocacaoEquipamento)
            res.json(AlocEquipDTO)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            const novoDTO = AlocacaoEquipamentoMapper.toDTO(novo)
            res.status(201).json(novoDTO)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            if (!edit) return res.status(404).json({ error: 'Alocação não encontrado'})
            const editDTO = AlocacaoEquipamentoMapper.toDTO(edit)
            res.json(editDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    delete: async (req, res) => {
        try {
            const dell = await service.delete(req.params.id)
            if (!dell) return res.status(404).json({ error: 'Alocação não encontrado'})
            res.status(204).end()
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = AlocacaoEquipamentoController