const { QueryTypes, sequelize, Sequelize } = require('sequelize')
const { StatusCodes } = require('http-status-codes')
const Libro = require('../models/libro')
const Tema  = require('../models/tema')
const Idioma    = require('../models/idioma')
const Editorial = require('../models/editorial')
const Message   = require('../utils/message')
const asyncHandler  = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Ok = require('../utils/ok')
const Constant = require('../utils/constant')
const dbConfig  = require('../config/database')

const db = new Sequelize(dbConfig)

exports.obtenerLibros = async (req, res) => {    
    const sort = req.query.sort
    let publicado = req.query.publicado
    let paginas   = req.query.paginas
    const tema    = req.query.tema
    const idioma  = req.query.idioma
    const editorial = req.query.editorial
    const limit  = req.query.limit || Constant.LIMIT_LIBROS
    const offset = req.query.offset || Constant.OFFSET_LIBROS    
    
    let sql = 'SELECT libros.*, temas.nombre as tema, idiomas.nombre as idioma, editoriales.nombre as editorial FROM libros '
    sql = sql + 'JOIN temas ON libros.tema_id = temas.id '
    sql = sql + 'JOIN idiomas ON libros.idioma_id = idiomas.id '
    sql = sql + 'JOIN editoriales ON libros.editorial_id = editoriales.id '
    sql = sql + 'WHERE 1 = 1'
    
    if (tema) {
        sql = sql + ` AND tema_id = ${tema}`
    }
    
    if (idioma) {
        sql = sql + ` AND idioma_id = ${idioma}`
    }
    
    if (editorial) {
        sql = sql + ` AND editorial_id = ${editorial}`
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

    if (paginas) {
        if (paginas[0] === '+') {
            paginas = paginas.replace('+', '')
            sql = sql + ` AND paginas >= ${paginas}`
        }
        else if (paginas[0] === '-') {
            paginas = paginas.replace('-', '')
            sql = sql + ` AND paginas <= ${paginas}`
        }
        else {
            sql = sql + ` AND paginas = ${paginas}`
        }
    }

    if (sort) {
        direction = sort[0] == '+' ? 'ASC' : 'DESC'
        orderby = sort.replace('-','').replace('+', '')
        sql = sql + ` ORDER BY ${orderby} ${direction}`
    }  
   
    //sql = sql + ` LIMIT ${offset}, ${limit} `
        
    const libros = await db.query(sql, { type: QueryTypes.SELECT })
    
    Ok(res, StatusCodes.OK, null, libros)
}

exports.obtenerLibro = async (req, res, next) => {              
    const { id } = req.params

    const libro = await Libro.findByPk(id, {
        include: [
            {
                association: 'tema'
            },
            {
                association: 'idioma'
            },
            {
                association: 'editorial'
            }
        ]
    })

    if (!libro) {
        return next(new ErrorResponse(Message.LIBRO_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }
    
    Ok(res, StatusCodes.OK, null, libro)
}

exports.registrarLibro = asyncHandler (async (req, res, next) => {              
    const { titulo, paginas, publicado, edicion, observaciones, tema_id, idioma_id, editorial_id } = req.body

    const tema = await Tema.findByPk(tema_id)   

    if (!tema) {
        return next(new ErrorResponse(Message.TEMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const idioma = await Idioma.findByPk(idioma_id)

    if (!idioma) {
        return next(new ErrorResponse(Message.IDIOMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const editorial = await Editorial.findByPk(editorial_id)

    if (!editorial) {
        return next(new ErrorResponse(Message.EDITORIAL_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    await Libro.create({titulo, paginas, publicado, edicion, observaciones, tema_id, idioma_id, editorial_id})

    Ok(res, StatusCodes.CREATED, Message.LIBRO_REGISTRADO)
})

exports.actualizarLibro = asyncHandler (async (req, res, next) => {    
    const { id } = req.params
    const { titulo, paginas, publicado, edicion, observaciones, tema_id, idioma_id, editorial_id } = req.body

    let libro = await Libro.findByPk(id)

    if (!libro) {
        return next(new ErrorResponse(Message.LIBRO_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const tema = await Tema.findByPk(tema_id)   

    if (!tema) {
        return next(new ErrorResponse(Message.TEMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const idioma = await Idioma.findByPk(idioma_id)

    if (!idioma) {
        return next(new ErrorResponse(Message.IDIOMA_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    const editorial = await Editorial.findByPk(editorial_id)

    if (!editorial) {
        return next(new ErrorResponse(Message.EDITORIAL_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    libro.titulo  = titulo
    libro.paginas = paginas
    libro.publicado = publicado
    libro.edicion   = edicion
    libro.observaciones = observaciones
    libro.tema_id   = tema_id
    libro.idioma_id = idioma_id
    libro.editorial_id = editorial_id    

    await libro.save()

    Ok(res, StatusCodes.OK, Message.LIBRO_ACTUALIZADO)
})

exports.borrarLibro = asyncHandler (async (req, res, next) => {    
    const { id } = req.params

    const libro = await Libro.findByPk(id)

    if (!libro) {
        return next(new ErrorResponse(Message.LIBRO_NO_ENCONTRADO, StatusCodes.NOT_FOUND))   
    }

    await libro.destroy()

    Ok(res, StatusCodes.OK, Message.LIBRO_BORRADO)
})

exports.obtenerPaginasLibros = asyncHandler (async (req, res, next) => {        
    const data = await Libro.findAll({
        attributes: [    
            [Sequelize.fn('sum', Sequelize.col('paginas')), 'paginas'],
            [Sequelize.fn('count', Sequelize.col('id')), 'libros'],
        ],
        raw: true        
    })

    const total_libros  = data[0].libros
    const total_paginas = data[0].paginas
    
    res.status(StatusCodes.OK).json({
        status: Message.SUCCESS,
        total_libros,
        total_paginas         
    })
})