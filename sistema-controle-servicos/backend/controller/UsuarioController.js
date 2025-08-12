const service = require('../services/UsuarioService')
const UsuarioMapper = require('../mappers/UsuarioMapper')

const UsuarioController = {
    getAll: async (req, res) => {
        try {
            const Usuarios = await service.getAll()
            const UsuariosDTO = Usuarios.map(U => UsuarioMapper.toDTO(U))
            res.json(UsuariosDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    getById: async (req, res) => {
        try {
            const Usuario = await service.getById(req.params.id)
            if (!Usuario) return res.status(404).json({ error: "Usuario não encontrado"})
            const UsuarioDTO = UsuarioMapper.toDTO(Usuario)
            res.json(UsuarioDTO)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    create: async (req, res) => {
        try {
            const novo = await service.create(req.body)
            const novoDTO = UsuarioMapper.toDTO(novo)
            res.status(201).json(novoDTO)
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    update: async (req, res) => {
        try {
            const edit = await service.update(req.params.id, req.body)
            if (!edit) return res.status(404).json({ error: 'Usuario não encontrado'})
            const editDTO = UsuarioMapper.toDTO(edit)
            res.json(editDTO)
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    },

    delete: async (req, res) => {
        try {
            const dell = await service.delete(req.params.id)
            if (!dell) return res.status(404).json({ error: 'Usuario não encontrado'})
            res.status(204).end()
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = UsuarioController