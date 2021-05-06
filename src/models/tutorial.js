const { Model, DataTypes } = require('sequelize')
const Message = require('../utils/message')

class Tutorial extends Model {
    static init(sequelize) {
        super.init({
            titulo: {
                type: DataTypes.STRING,
                allowNull: false,    
                validate: {
                    notEmpty: {
                        msg: Message.TUTORIAL_TITULO_REQUERIDO
                    }
                }    
            },
            duracion: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {                      
                        msg: Message.TUTORIAL_DURACION_NUMERICO
                    },
                    min: {
                        args: 1,
                        msg: Message.TUTORIAL_DURACION_MINIMO
                    },
                    notEmpty: {
                        msg: Message.TUTORIAL_DURACION_REQUERIDO
                    }
                }          
            },
            publicado: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {                      
                        msg: Message.TUTORIAL_PUBLICADO_NUMERICO
                    },
                    max: {
                        args: new Date().getFullYear(),
                        msg: Message.TUTORIAL_PUBLICADO_MAXIMO
                    },
                    notEmpty: {
                        msg: Message.TUTORIAL_PUBLICADO_REQUERIDO
                    }
                }          
            },
            actualizado: {
                type: DataTypes.STRING,
                allowNull: true
            },
            observaciones: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'tutoriales',
            timestamps: false      
        })
    }

    static associate(models) {
        this.belongsTo(models.Tema, { foreignKey: 'tema_id', as: 'tema' })
        this.belongsTo(models.Idioma, { foreignKey: 'idioma_id', as: 'idioma' })
        this.belongsTo(models.Fabricante, { foreignKey: 'fabricante_id', as: 'fabricante' })        
    }
}

module.exports = Tutorial