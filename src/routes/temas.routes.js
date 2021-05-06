const express = require('express')
const temasController = require('../controllers/temas.controller')

const router = express.Router()

router.get('/', temasController.obtenerTemas)
router.get('/:id', temasController.obtenerTema)
router.get('/:id/libros', temasController.obtenerLibrosPorTema)
router.get('/:id/tutoriales', temasController.obtenerTutorialesPorTema)
router.post('/', temasController.registrarTema)
router.put('/:id', temasController.actualizarTema)

module.exports = router
