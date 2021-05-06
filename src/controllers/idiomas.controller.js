const { StatusCodes } = require('http-status-codes')
const sequelize = require('sequelize')
const Idioma = require('../models/idioma')
const Message  = require('../utils/message')
const Constant = require('../utils/constant')
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Ok = require('../utils/ok')

exports.obtenerIdiomas = asyncHandler (async (req, res) => {                  
    let sort = req.query.sort || '+nombre'   
    let direction = sort[0] === '+' ? 'ASC' : 'DESC'
    sort = sort.replace('+', '').replace('-', '')
    
    const limit  = parseInt(req.query.limit)  || Constant.LIMIT_IDIOMAS
    const offset = parseInt(req.query.offset) || Constant.OFFSET_IDIOMAS       
    
    
    const idiomas = await Idioma.findAll({
        order: sequelize.literal(`${sort} ${direction}`),
        limit,
        offset        
    })           
    
    Ok(res, StatusCodes.OK, null, idiomas)
})

exports.obtenerIdioma = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const idioma = await Idioma.findByPk(id)

    if (!idioma) {
        return next(new ErrorResponse(Message.IDIOMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))            
    }

    Ok(res, StatusCodes.OK, null, idioma)
})

exports.registrarIdioma = asyncHandler (async (req, res) => {
    const { nombre } = req.body
    
    await Idioma.create({ nombre })    

    Ok(res, StatusCodes.CREATED, Message.IDIOMA_REGISTRADO)
})

exports.actualizarIdioma = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const { nombre } = req.body
    
    let idioma = await Idioma.findByPk(id)

    if (!idioma) {
        return next(new ErrorResponse(Message.IDIOMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    idioma.nombre = nombre
    await idioma.save()
    
    Ok(res, StatusCodes.OK, Message.IDIOMA_ACTUALIZADO)    
})

exports.obtenerTutorialesPorIdioma = asyncHandler (async (req, res) => {
    const libros = await Idioma.findByPk(req.params.id, {
        include: { association: 'tutoriales' },
        order: [
            ['tutoriales', 'titulo', 'ASC']
        ]
    })  
    
    Ok(res, StatusCodes.OK, null, libros)    
})

exports.obtenerLibrosPorIdioma = asyncHandler (async (req, res) => {
    const tutoriales = await Idioma.findByPk(req.params.id, {        
        include: { association: 'libros' },
        order: [
            ['libros', 'titulo', 'ASC']
        ]
    })  

    Ok(res, StatusCodes.OK, null, tutoriales)
})