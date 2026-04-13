'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follow_up_template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      follow_up_template.belongsTo(models.doctor, { foreignKey: 'doctorId' });
      follow_up_template.hasMany(models.follow_up_question, {foreignKey: 'templateId', as: 'questions'}); // <--- Si usas un alias, es más fácil de manejar
      // follow_up_template.hasMany(models.daily_record, { foreignKey: 'templateId', as: 'records' });
    }
  }
  follow_up_template.init({
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'doctor',
          key: 'id'
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
  }, {
    sequelize,
    modelName: 'follow_up_template',
    timestamps: true,
  });
  return follow_up_template;
};