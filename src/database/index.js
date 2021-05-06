const Sequelize = require('sequelize')
const dbConfig  = require('../config/database')
const Tema   = require('../models/tema')
const Idioma = require('../models/idioma')
const Editorial  = require('../models/editorial')
const Fabricante = require('../models/fabricante')
const Libro      = require('../models/libro')
const Tutorial   = require('../models/tutorial')

const connection = new Sequelize(dbConfig)

Tema.init(connection)
Idioma.init(connection)
Editorial.init(connection)
Fabricante.init(connection)
Libro.init(connection)
Tutorial.init(connection)

Tema.associate(connection.models)
Idioma.associate(connection.models)
Editorial.associate(connection.models)
Fabricante.associate(connection.models)
Libro.associate(connection.models)
Tutorial.associate(connection.models)

module.exports = connection