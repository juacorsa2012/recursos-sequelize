'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE INDEX idx_tutoriales_titulo ON tutoriales(titulo)')
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP INDEX idx_tutoriales_titulo')
  }
};