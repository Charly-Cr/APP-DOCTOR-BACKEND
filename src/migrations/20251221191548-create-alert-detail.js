'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alert_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      alertId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model:'alerts',
          key: 'id'
      },
      onDelete: 'CASCADE'
     },
     question: {
      type: Sequelize.STRING,
      allowNull: false
     },
     answer: {
      type: Sequelize.STRING,
      allowNull: false
     },
     type: {
      type: Sequelize.STRING,
      allowNull: false
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
    await queryInterface.dropTable('alert_details');
  }
};