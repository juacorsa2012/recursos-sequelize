const { Model, DataTypes } = require('sequelize')
const { LONGITUD_MAXIMA_NOMBRE_TEMA, LONGITUD_MINIMA_NOMBRE_TEMA } = require('../utils/constant')

class Tema extends Model {
  static init(sequelize) {
    super.init({
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [LONGITUD_MINIMA_NOMBRE_TEMA, LONGITUD_MAXIMA_NOMBRE_TEMA],
            msg: `El nombre del tema debe tener un mínimo de ${LONGITUD_MINIMA_NOMBRE_TEMA} caracteres y un máximo de ${LONGITUD_MAXIMA_NOMBRE_TEMA}.`
          }
        }
      }
    }, {
      sequelize,
      tableName: 'temas',
      timestamps: false      
    })
  }

  static associate(models) {    
    this.hasMany(models.Libro, { foreignKey: 'tema_id', as: 'libros' })
    this.hasMany(models.Tutorial, { foreignKey: 'tema_id', as: 'tutoriales' })
  }
}

module.exports = Tema