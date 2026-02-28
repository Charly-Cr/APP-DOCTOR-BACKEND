'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class daily_record_answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      daily_record_answer.belongsTo(models.daily_record, {foreignKey: 'dailyRecordId'});
      daily_record_answer.belongsTo(models.follow_up_question, {foreignKey: 'questionId'});
    }
  }
  daily_record_answer.init({
    dailyRecordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'daily_record',
          key: 'id'
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'follow_up_question',
          key: 'id'
        },
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false
      },
  }, {
    sequelize,
    modelName: 'daily_record_answer',
    timestamps: true,
  });
  return daily_record_answer;
};