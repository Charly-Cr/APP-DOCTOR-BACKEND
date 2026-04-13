'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Cambiamos la columna templateId para que acepte NULL
    await queryInterface.changeColumn('daily_records', 'templateId', {
      type: Sequelize.INTEGER,
      allowNull: true, // 👈 Aquí está la clave para tu flujo
      references: {
        model: 'follow_up_templates', // Asegúrate que este sea el nombre real de tu tabla
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    // Para revertir en caso de error (vuelve a ser obligatorio)
    await queryInterface.changeColumn('daily_records', 'templateId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
