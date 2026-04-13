'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('daily_records', 'type', {
      type: Sequelize.ENUM('CONSULTA', 'SEGUIMIENTO', 'ALERTA'),
      allowNull: false,
      defaultValue: 'CONSULTA'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('daily_records', 'type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_daily_records_type";');
  }
};
