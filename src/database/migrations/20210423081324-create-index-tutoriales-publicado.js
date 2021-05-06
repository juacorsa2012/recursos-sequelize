'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE INDEX idx_tutoriales_publicado ON tutoriales(publicado)')
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP INDEX idx_tutoriales_publicado')
  }
};