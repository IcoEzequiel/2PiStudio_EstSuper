const express = require('express')
const router = express.Router()
const cont = require('../controller/FuncionarioController')
const { verifyToken, checkRole } = require('../middleware/authMiddleware')

// Rotas do Funcionario

router.use(verifyToken)
router.get('/', cont.getAll)
router.get('/:id',cont.getById)
router.post('/',checkRole('administrador'), cont.create)
router.put('/:id', cont.update)
router.delete('/:id',checkRole('administrador'), cont.delete)

module.exports = router