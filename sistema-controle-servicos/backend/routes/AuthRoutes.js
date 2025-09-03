const express = require('express')
const router = express.Router()
const AuthController = require('../controller/AuthController')

// Rota do login
router.post('/login', AuthController.login)

module.exports = router