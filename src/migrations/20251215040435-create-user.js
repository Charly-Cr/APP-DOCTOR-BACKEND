'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
      role: {
        type: Sequelize.ENUM("superadmin", "doctor", "patient"),
        allowNull: false,
        defaultValue: "patient"
      },
      acceptedTerms: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
      },
      acceptedTermsAt: {
      type: Sequelize.DATE,
      allowNull: true
      },
      mustChangePassword: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") //marca de tiempo actual
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") //marca de tiempo actual
      }
    });

    await queryInterface.addIndex('users', ['email'], { name: 'users_email_idx' });
    await queryInterface.addIndex('users', ['role'], { name: 'users_role_idx' });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    await queryInterface.removeIndex('users', 'users_email_idx');
    await queryInterface.removeIndex('users', 'users_role_idx');
  }
};