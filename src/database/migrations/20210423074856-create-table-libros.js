'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('libros', { 
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
      paginas: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      edicion: {
        type: Sequelize.STRING,
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
      idioma_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'idiomas', key: 'id' }
      },
      editorial_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'editoriales', key: 'id' }
      }
    })      
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('libros');    
  }
};
