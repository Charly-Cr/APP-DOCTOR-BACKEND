'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctors', {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: false
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      subscriptionStatus: {
        type: Sequelize.ENUM('inactive', 'active', 'past_due', 'cancelled'),
        defaultValue: 'inactive'
      },
      subscriptionEndsAt: {
      type: Sequelize.DATE,
      allowNull: true
      },
      licenseNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
      },
      degreeImage: {
      type: Sequelize.STRING,
      allowNull: false
    },
    acceptedTerms: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    acceptedTermsAt: {
      type: Sequelize.DATE,
      allowNull: true  // Este sí debe ser true porque solo se llena cuando aceptan
    },
    contractVersion: { // 👈 Para saber qué versión del contrato firmó
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "v1.0-2026"
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
      },
     });

      await queryInterface.addIndex('doctors', ['verified'], { name: 'doctors_verified_idx' });
      await queryInterface.addIndex('doctors', ['subscriptionStatus'], { name: 'doctors_subscriptionStatus_idx' });
      
    },
    async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctors');
    await queryInterface.removeIndex('doctors', 'doctors_verified_idx');
    await queryInterface.removeIndex('doctors', 'doctors_subscriptionStatus_idx');
    
  }
 };