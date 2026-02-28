'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doctor_note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      doctor_note.belongsTo(models.alert, { foreignKey: 'alertId' });
      doctor_note.belongsTo(models.doctor, { foreignKey: 'doctorId' });
    }
  }
  doctor_note.init({
    alertId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alert',
        key: 'id'
      }
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctor',
        key: 'id'
      }
    },

    // 🧠 núcleo clínico
    observation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    clinicalAssessment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    actionPlan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    followUp: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'doctor_note',
    timestamps: true,
  });
  return doctor_note;
};