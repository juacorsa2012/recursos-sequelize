const { Model, DataTypes } = require('sequelize')
const { LONGITUD_MAXIMA_NOMBRE_IDIOMA, LONGITUD_MINIMA_NOMBRE_IDIOMA } = require('../utils/constant')

class Idioma extends Model {
  static init(sequelize) {
    super.init({
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [LONGITUD_MINIMA_NOMBRE_IDIOMA, LONGITUD_MAXIMA_NOMBRE_IDIOMA],
            msg: `El nombre del idioma debe tener un mínimo de ${LONGITUD_MINIMA_NOMBRE_IDIOMA} caracteres y un máximo de ${LONGITUD_MAXIMA_NOMBRE_IDIOMA}.`
          }
        }
      }
    }, {
      sequelize,
      tableName: 'idiomas',
      timestamps: false      
    })
  }

  static associate(models) {
    this.hasMany(models.Libro, { foreignKey: 'idioma_id', as: 'libros' })
    this.hasMany(models.Tutorial, { foreignKey: 'idioma_id', as: 'tutoriales' })
  }
}

module.exports = Idioma