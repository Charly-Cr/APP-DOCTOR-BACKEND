'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Es recomendable usar una transacción o simplemente esperar cada addColumn
    await queryInterface.addColumn('daily_records', 'reason_for_consultation', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('daily_records', 'illness_time', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('daily_records', 'vital_signs', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });

    await queryInterface.addColumn('daily_records', 'physical_exam', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });

    await queryInterface.addColumn('daily_records', 'diagnosis', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: []
    });

    await queryInterface.addColumn('daily_records', 'treatment', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: []
    });
  },

  async down (queryInterface, Sequelize) {
    // IMPORTANTE: Debes borrar todas las columnas en el orden inverso
    await queryInterface.removeColumn('daily_records', 'reason_for_consultation');
    await queryInterface.removeColumn('daily_records', 'illness_time');
    await queryInterface.removeColumn('daily_records', 'vital_signs');
    await queryInterface.removeColumn('daily_records', 'physical_exam');
    await queryInterface.removeColumn('daily_records', 'diagnosis');
    await queryInterface.removeColumn('daily_records', 'treatment');
  }
};
