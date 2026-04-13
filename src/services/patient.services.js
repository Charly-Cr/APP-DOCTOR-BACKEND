const { patient, doctor, user, follow_up_template } = require('../models');
const { notifyPatientAssignment } = require('./notification.service');

const createPatient = async (doctorUserId, {
  firstName,
  lastName,
  email,
  phone,
  passwordHash,
  acceptedTerms,
  mustChangePassword, birthDate, gender, address
}) => {
  // Buscamos al doctor
  const doctorProfile = await doctor.findOne({ where: { userId: doctorUserId } });
  if (!doctorProfile) return null;

  // Creamos el usuario siguiendo tu patrón exacto de createUser
  const newUser = await user.create({
    firstName,
    lastName,
    email,
    phone,
    password: passwordHash, // Mapeamos el hash al campo 'password' de tu DB
    role: 'patient',
    acceptedTerms, 
    acceptedTermsAt: acceptedTerms ? new Date() : null,
    mustChangePassword: mustChangePassword ?? true
  });

  // Creamos el registro de paciente vinculado
  const newPatient = await patient.create({
    userId: newUser.id,
    doctorId: doctorProfile.id,
    status: 'active',
    birthDate,
    gender,
    address
  });

  // Limpiamos la respuesta igual que en tu ejemplo
  const userJson = newUser.toJSON();
  delete userJson.password;

  return {
    ...newPatient.toJSON(),
    user: userJson
  };
};



const getMyPatients = async (doctorUserId) => {
  const doctorProfile = await doctor.findOne({ where: { userId: doctorUserId } });
  if (!doctorProfile) return [];

  return await patient.findAll({
    where: { doctorId: doctorProfile.id },
    include: {
      model: user,
      attributes: ['firstName', 'lastName', 'email'] // 👈 Filtro activado
    }
  });
};


// Esta función recibe el ID del paciente y el ID de la plantilla, y los conecta
const assignTemplate = async (patientId, templateId, doctorUserId) => {
    // 1. Buscamos al doctor
    const doctorProfile = await doctor.findOne({ 
        where: { userId: doctorUserId },
        include: [{ model: user }] 
    });
    if (!doctorProfile) return null;

    // 2. Buscamos la plantilla para tener su nombre
    const template = await follow_up_template.findByPk(templateId);

    // 3. Actualizamos al paciente
    const [rows] = await patient.update(
        { assignedTemplateId: templateId },
        { where: { id: patientId, doctorId: doctorProfile.id } }
    );

    if (rows > 0) {
        // 4. Buscamos los datos del paciente para su correo
        const updatedPatient = await patient.findByPk(patientId, {
            include: [{ model: user }]
        });

        // 5. ¡ENVIAMOS EL CORREO AL PACIENTE!
        notifyPatientAssignment(
            updatedPatient.user.email,
            updatedPatient.user.firstName,
            doctorProfile.user.lastName, // "Dr. Pérez"
            template.title
        );

        return updatedPatient;
    }
    
    return null;
};



const getMyPatientProfile = async (userId) => {
  return await patient.findOne({
    where: { userId },
    include: [
      {
        model: user,
        attributes: ['firstName', 'lastName', 'email', 'phone']
      },
      {
        model: doctor,
        attributes: ['id'],
        include: {
          model: user,
          attributes: ['firstName', 'lastName']
        }
      },
      {
        model: follow_up_template,
        as: 'assignedTemplate',
        attributes: ['id', 'title']
      }
    ]
  });
};

module.exports = {
  createPatient,
  getMyPatients,
  assignTemplate,
  getMyPatientProfile
};
