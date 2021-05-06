const { Model, DataTypes } = require('sequelize')
const {LONGITUD_MAXIMA_NOMBRE_EDITORIAL, LONGITUD_MINIMA_NOMBRE_EDITORIAL} = require('../utils/constant')

class Editorial extends Model {
  static init(sequelize) {
    super.init({
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [LONGITUD_MINIMA_NOMBRE_EDITORIAL, LONGITUD_MAXIMA_NOMBRE_EDITORIAL],
            msg: `El nombre de la editorial debe tener un mínimo de ${LONGITUD_MINIMA_NOMBRE_EDITORIAL} caracteres y un máximo de ${LONGITUD_MAXIMA_NOMBRE_EDITORIAL}.`
          }
        }
      }
    }, {
      sequelize,
      tableName: 'editoriales',
      timestamps: false      
    })
  }

  static associate(models) {
    this.hasMany(models.Libro, { foreignKey: 'editorial_id', as: 'libros' })    
  }
}

module.exports = Editorial