'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alert_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      alert_detail.belongsTo(models.alert, { foreignKey: 'alertId' });
    }
  }
  alert_detail.init({
    alertId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alert',
        key: 'id',
      }
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'alert_detail',
    timestamps: true,
  });
  return alert_detail;
};