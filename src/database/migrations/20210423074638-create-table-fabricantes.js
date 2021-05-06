'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fabricantes', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      }
    })    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fabricantes')    
  }
}
