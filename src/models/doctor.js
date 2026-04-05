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
      type: DataTypes.ENUM('inactive', 'active', 'past_due', 'cancelled'),
      defaultValue: 'inactive'
    },
    subscriptionEndsAt: {
    type: DataTypes.DATE,
    allowNull: true
    },
    licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
    },
    degreeImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acceptedTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptedTermsAt: {
      type: DataTypes.DATE,
      allowNull: true  // Este sí debe ser true porque solo se llena cuando aceptan
    },
    contractVersion: { // 👈 Para saber qué versión del contrato firmó
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "v1.0-2026"
    }
  }, {
    sequelize,
    modelName: 'doctor',
    timestamps: true, // ✅ Sequelize maneja createdAt y updatedAt
  });
  return doctor;
};