const express = require('express')
const router = express.Router()
const cont = require('../controller/ServicoController')

// Rotas do Serviço

router.get('/', cont.getAll)
router.get('/:id',cont.getById)
router.post('/', cont.create)
router.put('/:id', cont.update)
router.delete('/:id', cont.delete)

module.exports = router