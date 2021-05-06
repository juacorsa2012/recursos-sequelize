    const { Model, DataTypes } = require('sequelize')
    const Message = require('../utils/message')

    class Libro extends Model {
        static init(sequelize) {
            super.init({
                titulo: {
                    type: DataTypes.STRING,
                    allowNull: false,    
                    validate: {
                        notEmpty: {
                            msg: Message.LIBRO_TITULO_REQUERIDO
                        }
                    }    
                },
                paginas: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {                      
                            msg: Message.LIBRO_PAGINAS_NUMERICO
                        },
                        min: {
                            args: 1,
                            msg: Message.LIBRO_PAGINAS_MINIMO
                        },
                        notEmpty: {
                            msg: Message.LIBRO_PAGINAS_REQUERIDO
                        }
                    }          
                },
                publicado: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        isInt: {                      
                            msg: Message.LIBRO_PUBLICADO_NUMERICO
                        },
                        max: {
                            args: new Date().getFullYear(),
                            msg: Message.LIBRO_PUBLICADO_MAXIMO
                        },
                        notEmpty: {
                            msg: Message.LIBRO_PUBLICADO_REQUERIDO
                        }
                    }          
                },
                edicion: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                observaciones: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            }, {
                sequelize,
                tableName: 'libros',
                timestamps: false      
            })
        }

        static associate(models) {
            this.belongsTo(models.Tema, { foreignKey: 'tema_id', as: 'tema' })
            this.belongsTo(models.Idioma, { foreignKey: 'idioma_id', as: 'idioma' })
            this.belongsTo(models.Editorial, { foreignKey: 'editorial_id', as: 'editorial' })        
        }
    }

    module.exports = Libro