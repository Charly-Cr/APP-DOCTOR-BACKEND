const {
  patient,
  user,
  daily_record,
  daily_record_answer,
  follow_up_question,
  doctor,
  alert,
  doctor_note
} = require('../models');

const getPatientHistory = async (doctorUserId, patientId) => {
  // 1. Buscamos el perfil del doctor (usando el ID del usuario del JWT)
  const doctorProfile = await doctor.findOne({
    where: { userId: doctorUserId },
    attributes: ['id'] // Solo traemos el ID para ahorrar memoria
  });

  if (!doctorProfile) return null;

  // Validar que el paciente pertenece al doctor
  const patientProfile = await patient.findOne({
    where: {
      id: patientId,
      doctorId: doctorProfile.id
    },
    attributes: ['id']
  });

  if (!patientProfile) return 'FORBIDDEN';

  // 3. RETORNO DE DATA ORDENADA PARA GRÁFICOS
  return await daily_record.findAll({
    where: { patientId },
    order: [['recordDate', 'DESC']],
    include: [
      {
        model: daily_record_answer,
        include: [follow_up_question]
      },
      {
        model: alert,
        include: [{ model: doctor_note }]
      }
    ]
  });
};


const getPatientFullData = async (patientId) => {
  return await patient.findByPk(patientId, {
    include: [
      { model: user },
      {
        model: doctor,
        include: [{ model: user }]
      }
    ]
  });
};


/** 🔥 NUEVO SERVICIO PARA LA HISTORIA DEL PACIENTE **/
const getMyOwnHistory = async (userId) => {
  // 1. Buscamos el perfil del paciente asociado al usuario del JWT
  const patientProfile = await patient.findOne({
    where: { userId },
    attributes: ['id']
  });

  if (!patientProfile) return null;

  // 2. Traemos su historial (reutilizando tu lógica de includes)
  return await daily_record.findAll({
    where: { patientId: patientProfile.id },
    order: [['recordDate', 'DESC']],
    include: [
      {
        model: daily_record_answer,
        include: [follow_up_question]
      },
      {
        model: alert,
        include: [{ model: doctor_note }]
      }
    ]
  });
};

module.exports = {
  getPatientHistory,
  getPatientFullData,
  getMyOwnHistory
};
