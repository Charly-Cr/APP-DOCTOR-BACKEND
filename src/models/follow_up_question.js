'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follow_up_question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      follow_up_question.belongsTo(models.follow_up_template, {foreignKey: 'templateId'});
    }
  }
  follow_up_question.init({
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'follow_up_template',
          key: 'id'
        },
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('text', 'number', 'boolean'),
        allowNull: false
      },
      required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  }, {
    sequelize,
    modelName: 'follow_up_question',
    timestamps: true,
  });
  return follow_up_question;
};