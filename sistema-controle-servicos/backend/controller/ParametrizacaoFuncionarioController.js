const service = require('../services/ParametrizacaoFuncionarioService')

// Responsavel pela conexão, as rotas estão em uma pasta separada
// Todas as validações são necessarias, pos cada uma recebe um "null" do service
const ParametrizacaoFuncionarioController = {
    getAll: async (req, res) => {
        try {
            const ParaFuncs = await service.getAll()
            res.json(ParaFuncs)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const ParaFunc = await service.getById(req.params.id)
            if (!ParaFunc) return res.status(404).json({ error: "Parametrização não encontrado"})
            res.json(ParaFunc)
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

module.exports = ParametrizacaoFuncionarioController