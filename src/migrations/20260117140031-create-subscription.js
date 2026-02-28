'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'doctors', 
          key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      planType: {
        type: Sequelize.ENUM('mensual', 'anual', 'free_trial'),
        defaultValue: 'mensual'
      },
      status: {
        type: Sequelize.ENUM('active', 'expired', 'pending'),
        defaultValue: 'pending'
      },
      startDate: { 
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: { 
        type: Sequelize.DATE,
        allowNull: false,
      },
      paymentReference: { 
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('subscriptions');
  }
};