const express = require('express')
const fabricantesController = require('../controllers/fabricantes.controller')

const router = express.Router()

router.get('/', fabricantesController.obtenerFabricantes)
router.get('/:id', fabricantesController.obtenerFabricante)
router.get('/:id/tutoriales', fabricantesController.obtenerTutorialesPorFabricante)
router.post('/', fabricantesController.registrarFabricante)
router.put('/:id', fabricantesController.actualizarFabricante)

module.exports = router