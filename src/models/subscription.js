'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subscription.init({
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
          model: 'doctor', 
          key: 'id' },
      },
      planType: {
        type: DataTypes.ENUM('mensual', 'anual', 'free_trial'),
        defaultValue: 'mensual'
      },
      status: {
        type: DataTypes.ENUM('active', 'expired', 'pending'),
        defaultValue: 'pending'
      },
      startDate: { 
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: { 
        type: DataTypes.DATE,
        allowNull: false,
      },
      paymentReference: { 
        type: DataTypes.STRING,
      },
  }, {
    sequelize,
    modelName: 'subscription',
    timestamps: true,
  });
  return subscription;
};