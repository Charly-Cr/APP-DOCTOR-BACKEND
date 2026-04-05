'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
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
        onDelete: 'CASCADE'
      },
      assignedTemplateId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
      model: 'follow_up_templates', 
        key: 'id'
  }
},
      status: {
        type: Sequelize.ENUM('active', 'blocked'),
        defaultValue: 'active'
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

    await queryInterface.addIndex('patients', ['doctorId'], { name: 'patients_doctor_id_idx' });
    await queryInterface.addIndex('patients', ['status'], { name: 'patients_status_idx' });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('patients');
    await queryInterface.removeIndex('patients', 'patients_doctor_id_idx');
    await queryInterface.removeIndex('patients', 'patients_status_idx');
  }
};