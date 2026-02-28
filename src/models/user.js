'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.doctor, { foreignKey: 'userId' });
    }
  }
  user.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Verifica que sea un formato de correo válido
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100], // Mínimo 6 caracteres, máximo 255
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM("superadmin", "doctor", "patient"),
      allowNull: false,
      defaultValue: "patient"
    },
  }, {
    sequelize,
    modelName: 'user',
    timestamps: true, // ✅ Sequelize maneja createdAt y updatedAt
  });
  return user;
};