const express = require('express')
const router = express.Router()
const cont = require('../controller/AlocacaoFuncionarioController')
const { verifyToken, checkRole } = require('../middleware/authMiddleware')
// Rotas de Alocação de Funcionario

router.use(verifyToken)
router.get('/', cont.getAll)
router.get('/:id',cont.getById)
router.post('/',checkRole('administrador'), cont.create)
router.put('/:id',checkRole('administrador'), cont.update)
router.delete('/:id',checkRole('administrador'), cont.delete)

module.exports = router