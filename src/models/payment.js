'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      payment.belongsTo(models.doctor, { foreignKey: 'doctorId' });
    }
  }
  payment.init({
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
          model: 'doctor', 
          key: 'id' },
      },
      claimCode: { // El código único que el doctor verá para yapear
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      planType: {
        type: DataTypes.ENUM('mensual', 'anual'),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      externalReference: {
        type: DataTypes.STRING,
        allowNull: true
      },
      voucherImage: { // 👈 Nueva columna para la URL del comprobante
        type: DataTypes.STRING,
        allowNull: true
    }
  }, {
    sequelize,
    modelName: 'payment',
    timestamps: true,
  });
  return payment;
};