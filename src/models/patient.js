'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      patient.belongsTo(models.user, { foreignKey: 'userId' });
      patient.belongsTo(models.doctor, { foreignKey: 'doctorId' });
      patient.belongsTo(models.follow_up_template, { foreignKey: 'assignedTemplateId', as: 'assignedTemplate' });
    }
  }
  patient.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'user',
          key: 'id'
        },
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'doctor',
          key: 'id'
        },
      },
      assignedTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'assignedTemplateId', // <--- ESTO ES VITAL: Fuerza el nombre exacto de la columna en la DB
      references: {
      model: 'follow_up_templates', // Asegúrate que el nombre de la tabla sea plural si usaste migraciones
        key: 'id'
  }
},
      status: {
        type: DataTypes.ENUM('active', 'blocked'),
        defaultValue: 'active'
      },
  }, {
    sequelize,
    modelName: 'patient',
    timestamps: true, // ✅ Sequelize maneja createdAt y updatedAt
  });
  return patient;
};