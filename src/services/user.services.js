const { user, doctor, patient, payment } = require('../models');
const { deleteFromCloudinary } = require('../utils/cloudinary');

const getAllUser = async () => {
  return await user.findAll({
    attributes: { exclude: ["password"] }
  });
};


// Devuelve todos los usuarios sin la contraseña
const createUser = async ({
  firstName,
  lastName,
  email,
  phone,
  passwordHash,
  role
}) => {
  
  const newUser = await user.create({
    firstName,
    lastName,
    email,
    phone,
    password: passwordHash,
    role
  });

  const userJson = newUser.toJSON();
  delete userJson.password;
  return userJson;
};

const getOneUser = async (id) => {
  return await user.findByPk(id, {
    attributes: { exclude: ["password"] }, 
    include: [
      {
        model: doctor,
        include: [{ 
          model: payment, 
          as: 'payments',
          limit: 1, 
          order: [['createdAt', 'DESC']] // Traemos el pago más reciente
        }]
      }
    ]
  });
};

  
const putUser = async (body, id) => {
  return await user.update(
    body,
    { where: { id }, returning: true }
  );
}

const removeUser = async (userId) => {

  // 1. Antes de borrar, buscamos si hay imágenes asociadas en sus perfiles
  const doctorProfile = await doctor.findOne({ where: { userId } });
  const patientProfile = await patient.findOne({ where: { userId } });
  // 2. Si es doctor tiene imagen de título, borrar de Cloudinary
  if (doctorProfile?.degreeImage && !doctorProfile.degreeImage.includes('no-image.jpg')) {
    await deleteFromCloudinary(doctorProfile.degreeImage);
  }
  // 3. Si es paciente tiene foto de perfil, borrar de Cloudinary
  if (patientProfile?.profileImage && !patientProfile.profileImage.includes('no-image.jpg')) {
    await deleteFromCloudinary(patientProfile.profileImage);
  }
  // 4. Borramos al usuario. 
  // Gracias a tu migración con onDelete: 'CASCADE', esto borrará 
  // automáticamente la fila en la tabla 'doctors' o 'patients'.
  return await user.destroy({ where: { id: userId } });
  
};

const loginEmailUser = async (email) => {
  return await user.findOne({ where: { email } })
}

module.exports = {
  getAllUser,
  createUser,
  getOneUser,
  putUser,
  removeUser,
  loginEmailUser
}

