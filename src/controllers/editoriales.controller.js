const { StatusCodes } = require('http-status-codes')
const sequelize = require('sequelize')
const Editorial = require('../models/editorial')
const Message  = require('../utils/message')
const Constant = require('../utils/constant')
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Ok = require('../utils/ok')

exports.obtenerEditoriales = asyncHandler (async (req, res) => {              
    let sort = req.query.sort || '+nombre'
    let page = req.query.page || 1
    let direction = sort[0] == '+' ? 'ASC' : 'DESC'
    sort = sort.replace('-','').replace('+', '')             
    let offset = (Constant.LIMIT_EDITORIALES * page) - Constant.LIMIT_EDITORIALES
    
    const editoriales = await Editorial.findAll({
        order: sequelize.literal(`${sort} ${direction}`),
        limit: Constant.LIMIT_EDITORIALES,
        offset        
    })           
    
    Ok(res, StatusCodes.OK, null, editoriales) 
})

exports.obtenerEditorial = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const editorial = await Editorial.findByPk(id)

    if (!editorial) {
        return next(new ErrorResponse(Message.EDITORIAL_NO_ENCONTRADO, StatusCodes.NOT_FOUND))            
    }

    Ok(res, StatusCodes.OK, null, editorial)     
})

exports.registrarEditorial = asyncHandler (async (req, res) => {
    const { nombre } = req.body
    
    await Editorial.create({ nombre })    

    Ok(res, StatusCodes.OK, Message.EDITORIAL_REGISTRADO)
})

exports.actualizarEditorial = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const { nombre } = req.body
    
    let editorial = await Editorial.findByPk(id)

    if (!editorial) {
        return next(new ErrorResponse(Message.EDITORIAL_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }
    
    editorial.nombre = nombre
    await editorial.save()

    Ok(res, StatusCodes.OK, Message.EDITORIAL_ACTUALIZADO)       
})

exports.obtenerLibrosPorEditorial = asyncHandler (async (req, res) => {
    const libros = await Editorial.findByPk(req.params.id, {
        include: { association: 'libros' },
        order: [
            ['libros', 'titulo', 'ASC']
        ]
    })  
    
    Ok(res, StatusCodes.OK, null, libros)    
})