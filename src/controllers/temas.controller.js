const { StatusCodes } = require('http-status-codes')
const sequelize = require('sequelize')
const Tema = require('../models/tema')
const Message  = require('../utils/message')
const Constant = require('../utils/constant')
const asyncHandler  = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Ok = require('../utils/ok')

exports.obtenerTemas = asyncHandler (async (req, res) => {                  
    let sort = req.query.sort || '+nombre'
    let page = req.query.page || 1
    let direction = sort[0] == '+' ? 'ASC' : 'DESC'       
    let offset = (Constant.LIMIT_TEMAS * page) - Constant.LIMIT_TEMAS
    sort = sort.replace('-','').replace('+', '')             
    
    const temas = await Tema.findAll({
        order: sequelize.literal(`${sort} ${direction}`),
        limit: Constant.LIMIT_TEMAS,
        offset        
    })              

    Ok(res, StatusCodes.OK, null, temas)
})

exports.obtenerTema = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const tema = await Tema.findByPk(id)

    if (!tema) {
        return next(new ErrorResponse(Message.TEMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))
    }

    Ok(res, StatusCodes.OK, null, tema)     
})

exports.registrarTema = asyncHandler (async (req, res) => {
    const { nombre } = req.body
    
    await Tema.create({ nombre })    

    Ok(res, StatusCodes.CREATED, Message.TEMA_REGISTRADO)
})

exports.actualizarTema = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const { nombre } = req.body
    
    let tema = await Tema.findByPk(id)

    if (!tema) {
        return next(new ErrorResponse(Message.TEMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }
        
    tema.nombre = nombre
    await tema.save()

    Ok(res, StatusCodes.OK, Message.TEMA_ACTUALIZADO)   
})

exports.obtenerLibrosPorTema = asyncHandler (async (req, res, next) => {    
    const libros = await Tema.findByPk(req.params.id, {        
        include: { association: 'libros' },
        order: [
            ['libros', 'titulo', 'ASC']
        ]
    })  

    Ok(res, StatusCodes.OK, null, libros)
})

exports.obtenerTutorialesPorTema = asyncHandler (async (req, res, next) => {        
    const tutoriales = await Tema.findByPk(req.params.id, {
        include: { association: 'tutoriales' },
        order: [
            ['tutoriales', 'titulo', 'ASC']
        ]
    })  

    Ok(res, StatusCodes.OK, null, tutoriales)
}) 