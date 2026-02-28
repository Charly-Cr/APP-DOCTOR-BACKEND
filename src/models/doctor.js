'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      doctor.belongsTo(models.user, {foreignKey: 'userId' });
      doctor.hasMany(models.patient, {foreignKey: 'doctorId' });
      doctor.hasMany(models.payment, {foreignKey: 'doctorId', as: 'payments'});
    }
  }
  doctor.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'user',
          key: 'id'
        },
      },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'inactive'
    },
    licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "PENDING_LICENSE",
    unique: true
    },
    degreeImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "no-image.jpg" // O una URL por defecto
    },
    acceptedTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    acceptedTermsAt: {
      type: DataTypes.DATE,
      allowNull: true  // Este sí debe ser true porque solo se llena cuando aceptan
    },
  }, {
    sequelize,
    modelName: 'doctor',
    timestamps: true, // ✅ Sequelize maneja createdAt y updatedAt
  });
  return doctor;
};