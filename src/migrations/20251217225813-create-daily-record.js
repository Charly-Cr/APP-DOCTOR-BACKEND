'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      templateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'follow_up_templates',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      recordDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('daily_records');
  }
};