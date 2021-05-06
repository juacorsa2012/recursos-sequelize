const express = require('express')
const librosController = require('../controllers/libros.controller')

const router = express.Router()

router.get('/stats', librosController.obtenerPaginasLibros)
router.get('/', librosController.obtenerLibros)
router.get('/:id', librosController.obtenerLibro)
router.post('/', librosController.registrarLibro)
router.delete('/:id', librosController.borrarLibro)
router.put('/:id', librosController.actualizarLibro)

module.exports = router
