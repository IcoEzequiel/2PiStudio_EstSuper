const service = require('../services/ServicoService')
const ServicoMapper = require('../mappers/servicoMapper')

const ServicoController = {
    getAll: async (req, res) => {
        try {
            const servicos = await service.getAll()
            const servicosDTO = servicos.map(s => ServicoMapper.toDTO(s))
            res.json(servicosDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const servico = await service.getById(req.params.id)
            if (!servico) return res.status(404).json({ error: "Serviço não encontrado"})
            const servicoDTO = ServicoMapper.toDTO(servico)
            res.json(servicoDTO)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            const novoDTO = ServicoMapper.toDTO(novo)
            res.status(201).json(novoDTO)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            const editDTO = ServicoMapper.toDTO(edit)
            if (!edit) return res.status(404).json({ error: 'Serviço não encontrado'})
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

module.exports = ServicoController