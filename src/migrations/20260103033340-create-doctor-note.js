'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctor_notes', {
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
          model: 'alerts',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
      observation: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      clinicalAssessment: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      actionPlan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      followUp: {
        type: Sequelize.TEXT
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

    await queryInterface.addIndex('doctor_notes', ['alertId'], {
      name: 'doctor_notes_alert_id_idx'
    });
    await queryInterface.addIndex('doctor_notes', ['doctorId'], {
      name: 'doctor_notes_doctor_id_idx'
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctor_notes');
    await queryInterface.removeIndex('doctor_notes', 'doctor_notes_alert_id_idx');
    await queryInterface.removeIndex('doctor_notes', 'doctor_notes_doctor_id_idx');
  }
};