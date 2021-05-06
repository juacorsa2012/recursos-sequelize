require('./database')
const express = require('express')
const { StatusCodes } = require('http-status-codes')
const errorHandler = require('./middlewares/error')
const temasRoutes  = require('./routes/temas.routes')
const idiomasRoutes  = require('./routes/idiomas.routes')
const editorialesRoutes = require('./routes/editoriales.routes')
const fabricantesRoutes = require('./routes/fabricantes.routes')
const librosRoutes = require('./routes/libros.routes')
const tutorialesRoutes = require('./routes/tutoriales.routes')
const ErrorResponse = require('./utils/errorResponse')

const app = express()

app.use(express.json())
app.use('/api/v1/temas', temasRoutes)
app.use('/api/v1/idiomas', idiomasRoutes)
app.use('/api/v1/editoriales', editorialesRoutes)
app.use('/api/v1/fabricantes', fabricantesRoutes)
app.use('/api/v1/libros', librosRoutes)
app.use('/api/v1/tutoriales', tutorialesRoutes)

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Imposible encontrar ${req.originalUrl} en este servidor!`, StatusCodes.NOT_FOUND))
})

app.use(errorHandler)

module.exports = app