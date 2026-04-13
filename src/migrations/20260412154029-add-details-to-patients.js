'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('patients', 'birthDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('patients', 'gender', {
      type: Sequelize.ENUM('Masculino', 'Femenino', 'Otro'),
      allowNull: true,
    });
    await queryInterface.addColumn('patients', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('patients', 'birthDate');
    await queryInterface.removeColumn('patients', 'address');
    // Nota: Remover ENUMs en Postgres a veces requiere pasos extra, 
    // pero removeColumn suele bastar para limpiar la tabla.
    await queryInterface.removeColumn('patients', 'gender');
  }
};
