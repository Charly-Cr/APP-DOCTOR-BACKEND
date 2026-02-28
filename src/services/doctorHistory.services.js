const {
  patient,
  daily_record,
  daily_record_answer,
  follow_up_question,
  doctor,
  alert,
  doctor_note
} = require('../models');

const getPatientHistory = async (doctorUserId, patientId) => {
  const doctorProfile = await doctor.findOne({
    where: { userId: doctorUserId }
  });

  if (!doctorProfile) return null;

  // Validar que el paciente pertenece al doctor
  const patientProfile = await patient.findOne({
    where: {
      id: patientId,
      doctorId: doctorProfile.id
    }
  });

  if (!patientProfile) return 'FORBIDDEN';

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

module.exports = {
  getPatientHistory
};
