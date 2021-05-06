const express = require('express')
const idiomasController = require('../controllers/idiomas.controller')

const router = express.Router()

router.get('/', idiomasController.obtenerIdiomas)
router.get('/:id', idiomasController.obtenerIdioma)
router.get('/:id/libros', idiomasController.obtenerLibrosPorIdioma)
router.get('/:id/tutoriales', idiomasController.obtenerTutorialesPorIdioma)
router.post('/', idiomasController.registrarIdioma)
router.put('/:id', idiomasController.actualizarIdioma)

module.exports = router