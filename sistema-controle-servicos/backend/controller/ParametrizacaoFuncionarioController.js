const service = require('../services/ParametrizacaoFuncionarioService')
const ParametrizacaoFuncionarioMapper = require('../mappers/ParametrizacaoFuncionarioMapper')

const ParametrizacaoFuncionarioController = {
    getAll: async (req, res) => {
        try {
            const ParametrizacaoFuncionarios = await service.getAll()
            const ParaFuncDTO = ParametrizacaoFuncionarios.map(p => ParametrizacaoFuncionarioMapper.toDTO(p))
            res.json(ParaFuncDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const ParametrizacaoFuncionario = await service.getById(req.params.id)
            if (!ParametrizacaoFuncionario) return res.status(404).json({ error: "Parametrização não encontrado"})
            const ParaFuncDTO = ParametrizacaoFuncionarioMapper.toDTO(ParametrizacaoFuncionario)
            res.json(ParaFuncDTO)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            const novoDTO = ParametrizacaoFuncionarioMapper.toDTO(novo)
            res.status(201).json(novoDTO)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            if (!edit) return res.status(404).json({ error: 'Parametrização não encontrado'})
            const editDTO = ParametrizacaoFuncionarioMapper.toDTO(edit)
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

module.exports = ParametrizacaoFuncionarioController