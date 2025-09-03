const express = require('express')
const router = express.Router()
const cont = require('../controller/UsuarioController')
const { verifyToken, checkRole } = require('../middleware/authMiddleware')
// Rotas do Usuario

// verifica o token
router.use(verifyToken)

// Configuração das rotas, e quem pode acessa-las
router.get('/', cont.getAll)
router.get('/:id',cont.getById)
router.post('/',checkRole('administrador'), cont.create)
router.put('/:id',checkRole('administrador'), cont.update)
router.delete('/:id',checkRole('administrador'), cont.delete)

module.exports = router