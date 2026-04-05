'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alerts', {
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
        onDelete: 'CASCADE',
     },
     doctorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: 'doctors',
          key: 'id'
        },
        onDelete: 'CASCADE',
     },
     dailyRecordId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: 'daily_records',
          key: 'id'
        },
        onDelete: 'CASCADE',
     },
     severity: {
      type: Sequelize.ENUM('low', 'medium', 'high'),
      defaultValue: 'low'
     },
     summary: {
      type: Sequelize.STRING,
      allowNull: false,
    },
     read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
     },
     status: {
      type: Sequelize.ENUM('pending', 'seen', 'handled'),
      allowNull: false,
      defaultValue: 'pending'
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

    await queryInterface.addIndex('alerts', ['status'], { name: 'alerts_status_idx' });
    await queryInterface.addIndex('alerts', ['dailyRecordId'], { name: 'alerts_daily_record_id_idx' });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alerts');
    await queryInterface.removeIndex('alerts', 'alerts_status_idx');
    await queryInterface.removeIndex('alerts', 'alerts_daily_record_id_idx');
  }
};