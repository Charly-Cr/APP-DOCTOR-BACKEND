'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'doctors', key: 'id' },
        onDelete: 'CASCADE'
      },
      claimCode: { // El código único que el doctor verá para yapear
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      planType: {
        type: Sequelize.ENUM('mensual', 'anual'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      externalReference: {
        type: Sequelize.STRING,
        allowNull: true
      },
      voucherImage: { // 👈 Nueva columna para la URL del comprobante
        type: Sequelize.STRING,
        allowNull: true
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};