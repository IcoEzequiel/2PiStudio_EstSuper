const express = require('express')
const router = express.Router()
const cont = require('../controller/FeedbackController')
const { verifyToken, checkRole } = require('../middleware/authMiddleware')
// Rotas do Feedback

// verifica o token
router.use(verifyToken)
// Configuração das rotas, e quem pode acessa-las

router.get('/', cont.getAll)
router.get('/:id',cont.getById)
router.post('/', cont.create)
router.put('/:id', cont.update)
router.delete('/:id', cont.delete)

module.exports = router