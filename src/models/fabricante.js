const { Model, DataTypes } = require('sequelize')
const { LONGITUD_MAXIMA_NOMBRE_FABRICANTE, LONGITUD_MINIMA_NOMBRE_FABRICANTE } = require('../utils/constant')

class Fabricante extends Model {
  static init(sequelize) {
    super.init({
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [LONGITUD_MINIMA_NOMBRE_FABRICANTE, LONGITUD_MAXIMA_NOMBRE_FABRICANTE],
            msg: `El nombre del fabricante debe tener un mínimo de ${LONGITUD_MINIMA_NOMBRE_FABRICANTE} caracteres y un máximo de ${LONGITUD_MAXIMA_NOMBRE_FABRICANTE}.`
          }
        }
      }
    }, {
      sequelize,
      tableName: 'fabricantes',
      timestamps: false      
    })
  }

  static associate(models) {
    this.hasMany(models.Tutorial, { foreignKey: 'fabricante_id', as: 'tutoriales' })
  }
}

module.exports = Fabricante