const express = require('express')
const tutorialesController = require('../controllers/tutoriales.controller')

const router = express.Router()

router.get('/stats', tutorialesController.obtenerDuracionTutoriales)
router.get('/', tutorialesController.obtenerTutoriales)
router.get('/:id', tutorialesController.obtenerTutorial)
router.post('/', tutorialesController.registrarTutorial)
router.put('/:id', tutorialesController.actualizarTutorial)
router.delete('/:id', tutorialesController.borrarTutorial)

module.exports = router
