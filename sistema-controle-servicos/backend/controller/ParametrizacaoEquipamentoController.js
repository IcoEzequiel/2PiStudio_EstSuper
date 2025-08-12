const service = require('../services/ParametrizacaoEquipamentoService')
const ParametrizacaoEquipamentoMapper = require('../mappers/ParametrizacaoEquipamentoMapper')

const ParametrizacaoEquipamentoController = {
    getAll: async (req, res) => {
        try {
            const ParametrizacaoEquipamentos = await service.getAll()
            const paraEquiDTO = ParametrizacaoEquipamentos.map(p => ParametrizacaoEquipamentoMapper.toDTO(p))
            res.json(paraEquiDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const ParametrizacaoEquipamento = await service.getById(req.params.id)
            if (!ParametrizacaoEquipamento) return res.status(404).json({ error: "Parametrização não encontrado"})
            const paraEquiDTO = ParametrizacaoEquipamentoMapper.toDTO(ParametrizacaoEquipamento)
            res.json(paraEquiDTO)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            const novoDTO = ParametrizacaoEquipamentoMapper.toDTO(novo)
            res.status(201).json(novoDTO)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            if (!edit) return res.status(404).json({ error: 'Parametrização não encontrado'})
            const editDTO = ParametrizacaoEquipamentoMapper.toDTO(edit)
            res.json(editDTO)
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