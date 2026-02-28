'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_record_answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dailyRecordId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'daily_records',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'follow_up_questions',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('daily_record_answers');
  }
};