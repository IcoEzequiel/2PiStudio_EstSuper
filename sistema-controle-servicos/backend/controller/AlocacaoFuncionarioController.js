const service = require('../services/AlocacaoFuncionarioService')
const AlocacaoFuncionarioMapper = require('../mappers/AlocacaoFuncionarioMapper')

const AlocacaoFuncionarioController = {
    getAll: async (req, res) => {
        try {
            const AlocacaoFuncionarios = await service.getAll()
            const AlocFuncDTO = AlocacaoFuncionarios.map(a => AlocacaoFuncionarioMapper.toDTO(a))
            res.json(AlocFuncDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const AlocacaoFuncionario = await service.getById(req.params.id)
            if (!AlocacaoFuncionario) return res.status(404).json({ error: "Alocaçao não encontrado"})
            const AlocFuncDTO = AlocacaoFuncionarioMapper.toDTO(AlocacaoFuncionario)
            res.json(AlocFuncDTO)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            const novoDTO = AlocacaoFuncionarioMapper.toDTO(novo)
            res.status(201).json(novoDTO)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            if (!edit) return res.status(404).json({ error: 'Alocaçao não encontrado'})
            const editDTO = AlocacaoFuncionarioMapper.toDTO(edit)
            res.json(editDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    delete: async (req, res) => {
        try {
            const dell = await service.delete(req.params.id)
            if (!dell) return res.status(404).json({ error: 'Alocaçao não encontrado'})
            res.status(204).end()
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = AlocacaoFuncionarioController