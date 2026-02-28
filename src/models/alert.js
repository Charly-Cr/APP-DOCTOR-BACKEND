'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alert extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      alert.belongsTo(models.patient, { foreignKey: 'patientId' });
      alert.belongsTo(models.doctor, { foreignKey: 'doctorId' });
      alert.belongsTo(models.daily_record, { foreignKey: 'dailyRecordId' });
      alert.hasMany(models.alert_detail, { foreignKey: 'alertId' });
      alert.hasOne(models.doctor_note, { foreignKey: 'alertId' });
    }
  }
  alert.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'patient',
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
    dailyRecordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'daily_record',
          key: 'id'
        },
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'low'
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'seen', 'handled'),
      allowNull: false,
      defaultValue: 'pending'
  },
  }, {
    sequelize,
    modelName: 'alert',
    timestamps: true,
  });
  return alert;
};