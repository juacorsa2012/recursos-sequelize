'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE INDEX idx_libros_publicado ON libros(publicado)')
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP INDEX idx_libros_publicado')
  }
};