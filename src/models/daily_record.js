'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class daily_record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      daily_record.belongsTo(models.patient, { foreignKey: 'patientId' });
      daily_record.belongsTo(models.follow_up_template, { foreignKey: 'templateId' });
      daily_record.hasMany(models.daily_record_answer, {foreignKey: 'dailyRecordId'});
      daily_record.hasOne(models.alert, { foreignKey: 'dailyRecordId' });
    }
  }
  daily_record.init({
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'patient',
          key: 'id'
        },
      },
      templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'follow_up_template',
          key: 'id'
        },
      },
      recordDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
      },
  }, {
    sequelize,
    modelName: 'daily_record',
    timestamps: true,
  });
  return daily_record;
};