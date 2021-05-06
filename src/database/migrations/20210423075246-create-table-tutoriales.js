'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tutoriales', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      titulo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      publicado: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      duracion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      actualizado: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      observaciones: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      tema_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'temas', key: 'id' }
      },
      fabricante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'fabricantes', key: 'id' }
      },
      idioma_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'idiomas', key: 'id' }
      },
      fabricante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'fabricantes', key: 'id' }
      }
    })      
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tutoriales')
  }
};
