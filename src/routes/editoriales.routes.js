const express = require('express')
const editorialesController = require('../controllers/editoriales.controller')

const router = express.Router()

router.get('/', editorialesController.obtenerEditoriales)
router.get('/:id', editorialesController.obtenerEditorial)
router.get('/:id/libros', editorialesController.obtenerLibrosPorEditorial)
router.post('/', editorialesController.registrarEditorial)
router.put('/:id', editorialesController.actualizarEditorial)

module.exports = router