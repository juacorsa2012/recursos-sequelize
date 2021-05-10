const { QueryTypes, sequelize, Sequelize } = require('sequelize')
const { StatusCodes } = require('http-status-codes')
const Tutorial = require('../models/tutorial')
const Tema = require('../models/tema')
const Idioma = require('../models/idioma')
const Fabricante = require('../models/fabricante')
const Message = require('../utils/message')
const asyncHandler  = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Ok = require('../utils/ok')
const Constant = require('../utils/constant')
const dbConfig = require('../config/database')

const db = new Sequelize(dbConfig)

exports.obtenerTutoriales = asyncHandler (async (req, res) => {    
    const sort = req.query.sort
    const page = req.query.page || 1
    let publicado = req.query.publicado
    let duracion  = req.query.duracion
    const tema    = req.query.tema
    const idioma  = req.query.idioma
    const fabricante = req.query.fabricante    
    
    let sql = 'SELECT tutoriales.*, temas.nombre as tema, idiomas.nombre as idioma, fabricantes.nombre as fabricante FROM tutoriales '
    sql = sql + 'JOIN temas ON tutoriales.tema_id = temas.id '
    sql = sql + 'JOIN idiomas ON tutoriales.idioma_id = idiomas.id '
    sql = sql + 'JOIN fabricantes ON tutoriales.fabricante_id = fabricantes.id '
    sql = sql + 'WHERE 1 = 1'
    
    if (tema) {
        sql = sql + ` AND tema_id = ${tema}`
    }
    
    if (idioma) {
        sql = sql + ` AND idioma_id = ${idioma}`
    }
    
    if (fabricante) {
        sql = sql + ` AND fabricante_id = ${fabricante}`
    }
    
    if (publicado) {
        if (publicado[0] === '+') {
            publicado = publicado.replace('+', '')
            sql = sql + ` AND publicado >= ${publicado}`
        }
        else if (publicado[0] === '-') {
            publicado = publicado.replace('-', '')
            sql = sql + ` AND publicado <= ${publicado}`
        }
        else {
            sql = sql + ` AND publicado = ${publicado}`
        }
    }

    if (duracion) {
        if (duracion[0] === '+') {
            duracion = duracion.replace('+', '')
            sql = sql + ` AND duracion >= ${duracion}`
        }
        else if (duracion[0] === '-') {
            duracion = duracion.replace('-', '')
            sql = sql + ` AND duracion <= ${duracion}`
        }
        else {
            sql = sql + ` AND duracion = ${duracion}`
        }
    }

    if (sort) {
        direction = sort[0] == '+' ? 'ASC' : 'DESC'
        orderby = sort.replace('-','').replace('+', '')
        sql = sql + ` ORDER BY ${orderby} ${direction}`
    }  
   
    let offset = (Constant.LIMIT_TUTORIALES * page) - Constant.LIMIT_TUTORIALES
    
    sql = sql + ` LIMIT ${Constant.LIMIT_TUTORIALES} OFFSET ${offset} `
        
    const tutoriales = await db.query(sql, { type: QueryTypes.SELECT })
    
    Ok(res, StatusCodes.OK, null, tutoriales)
})

exports.obtenerTutorial = asyncHandler (async (req, res, next) => {              
    const { id } = req.params

    const tutorial = await Tutorial.findByPk(id, {
        include: [
            {
                association: 'tema'
            },
            {
                association: 'idioma'
            },
            {
                association: 'fabricante'
            }
        ]
    })

    if (!tutorial) {
        return next(new ErrorResponse(Message.TUTORIAL_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }
    
    Ok(res, StatusCodes.OK, null, tutorial)
})

exports.registrarTutorial = asyncHandler (async (req, res, next) => {              
    const { titulo, duracion, publicado, actualizado, observaciones, tema_id, idioma_id, fabricante_id } = req.body

    const tema = await Tema.findByPk(tema_id)   

    if (!tema) {
        return next(new ErrorResponse(Message.TEMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const idioma = await Idioma.findByPk(idioma_id)

    if (!idioma) {
        return next(new ErrorResponse(Message.IDIOMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const fabricante = await Fabricante.findByPk(fabricante_id)

    if (!fabricante) {
        return next(new ErrorResponse(Message.FABRICANTE_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    await Tutorial.create({titulo, duracion, publicado, actualizado, observaciones, tema_id, idioma_id, fabricante_id})

    Ok(res, StatusCodes.CREATED, Message.TUTORIAL_REGISTRADO)
})

exports.actualizarTutorial = asyncHandler (async (req, res, next) => {    
    const { id } = req.params
    const { titulo, duracion, publicado, actualizado, observaciones, tema_id, idioma_id, fabricante_id } = req.body

    let tutorial = await Tutorial.findByPk(id)

    if (!tutorial) {
        return next(new ErrorResponse(Message.TUTORIAL_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const tema = await Tema.findByPk(tema_id)   

    if (!tema) {
        return next(new ErrorResponse(Message.TEMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const idioma = await Idioma.findByPk(idioma_id)

    if (!idioma) {
        return next(new ErrorResponse(Message.IDIOMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const fabricante = await Fabricante.findByPk(fabricante_id)

    if (!fabricante) {
        return next(new ErrorResponse(Message.FABRICANTE_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    tutorial.titulo = titulo
    tutorial.duracion = duracion
    tutorial.publicado = publicado
    tutorial.actualizado = actualizado
    tutorial.observaciones = observaciones
    tutorial.tema_id = tema_id
    tutorial.idioma_id = idioma_id
    tutorial.fabricante_id = fabricante_id    

    await tutorial.save()

    Ok(res, StatusCodes.OK, Message.TUTORIAL_ACTUALIZADO)
})

exports.borrarTutorial = asyncHandler (async (req, res, next) => {    
    const { id } = req.params

    const tutorial = await Tutorial.findByPk(id)

    if (!tutorial) {
        return next(new ErrorResponse(Message.TUTORIAL_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    await tutorial.destroy()

    Ok(res, StatusCodes.OK, Message.TUTORIAL_BORRADO)
})

exports.obtenerDuracionTutoriales = asyncHandler (async (req, res, next) => {    
    const data = await Tutorial.findAll({
        attributes: [    
            [Sequelize.fn('sum', Sequelize.col('duracion')), 'duracion'],
            [Sequelize.fn('count', Sequelize.col('id')), 'tutoriales'],
        ],
        raw: true
    })

    const total_tutoriales = data[0].tutoriales
    const total_duracion = data[0].duracion

    res.status(StatusCodes.OK).json({
        status: Message.SUCCESS,
        total_duracion,
        total_tutoriales
    })
})