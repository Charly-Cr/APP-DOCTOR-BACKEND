'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('doctors', 'licenseNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "PENDING_LICENSE", // Valor temporal para registros existentes
      unique: true
    });

    await queryInterface.addColumn('doctors', 'degreeImage', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "no-image.jpg" // O una URL por defecto
    });

    await queryInterface.addColumn('doctors', 'acceptedTerms', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('doctors', 'acceptedTermsAt', {
      type: Sequelize.DATE,
      allowNull: true // Este sí debe ser true porque solo se llena cuando aceptan
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('doctors', 'licenseNumber');
    await queryInterface.removeColumn('doctors', 'degreeImage');
    await queryInterface.removeColumn('doctors', 'acceptedTerms');
    await queryInterface.removeColumn('doctors', 'acceptedTermsAt');
  }
};
