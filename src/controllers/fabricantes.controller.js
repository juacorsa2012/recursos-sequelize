const { StatusCodes } = require('http-status-codes')
const sequelize = require('sequelize')
const Fabricante = require('../models/fabricante')
const Message  = require('../utils/message')
const Constant = require('../utils/constant')
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Ok = require('../utils/ok')

exports.obtenerFabricantes = asyncHandler (async (req, res) => {              
    let sort = req.query.sort || '+nombre'
    let direction = sort[0] == '+' ? 'ASC' : 'DESC'
    sort = sort.replace('-','').replace('+', '')             

    const limit  = parseInt(req.query.limit)  || Constant.LIMIT_FABRICANTES
    const offset = parseInt(req.query.offset) || Constant.OFFSET_FABRICANTES
    
    const fabricantes = await Fabricante.findAll({
        order: sequelize.literal(`${sort} ${direction}`),
        limit,
        offset        
    })               

    Ok(res, StatusCodes.CREATED, fabricantes)
})

exports.obtenerFabricante = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const fabricante = await Fabricante.findByPk(id)

    if (!fabricante) {
        return next(new ErrorResponse(Message.FABRICANTE_NO_ENCONTRADO, StatusCodes.NOT_FOUND))            
    }

    Ok(res, StatusCodes.CREATED, null, fabricante)
})

exports.registrarFabricante = asyncHandler (async (req, res) => {
    const { nombre } = req.body
    
    await Fabricante.create({ nombre })
    
    res.status(StatusCodes.CREATED).json({
        status : Message.SUCCESS,
        message: Message.FABRICANTE_REGISTRADO
    }) 

    Ok(res, StatusCodes.CREATED, Message.FABRICANTE_REGISTRADO)
})

exports.actualizarFabricante = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const { nombre } = req.body
    
    let fabricante = await Fabricante.findByPk(id)

    if (!fabricante) {
        return next(new ErrorResponse(Message.FABRICANTE_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    fabricante.nombre = nombre
    await fabricante.save()    

    Ok(res, StatusCodes.CREATED, Message.FABRICANTE_ACTUALIZADO)
})

exports.obtenerTutorialesPorFabricante = asyncHandler (async (req, res) => {
    const tutoriales = await Fabricante.findByPk(req.params.id, {        
        include: { association: 'tutoriales' },
        order: [
            ['tutoriales', 'titulo', 'ASC']
        ]
    })  
    
    Ok(res, StatusCodes.OK, null, tutoriales)
})