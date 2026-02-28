const { patient, doctor, user } = require('../models');

const createPatient = async (doctorUserId, body) => {
    const doctorProfile = await doctor.findOne({ where: { userId: doctorUserId } });
    if (!doctorProfile) return null;

    return await patient.create({
        ...body,
        doctorId: doctorProfile.id
    });
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
    const doctorProfile = await doctor.findOne({ where: { userId: doctorUserId } });
    if (!doctorProfile) return null;

    const [rows] = await patient.update(
        { assignedTemplateId: templateId },
        { where: { id: patientId, doctorId: doctorProfile.id } }
    );
    
    return rows > 0 ? await patient.findByPk(patientId) : null;
};


module.exports = {
  createPatient,
  getMyPatients,
  assignTemplate
};
