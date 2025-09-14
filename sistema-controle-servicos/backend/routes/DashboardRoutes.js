const express = require('express')
const router = express.Router()
const cont = require('../controller/DashboardController')
const { verifyToken, checkRole } = require('../middleware/authMiddleware')

router.use(verifyToken)

router.get('/',checkRole('administrador'), cont.getData)

module.exports = router