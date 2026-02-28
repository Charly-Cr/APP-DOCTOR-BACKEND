const { doctor_note, alert } = require('../models');

const createDoctorNote = async (doctorId, alertId, body) => {
  const alertFound = await alert.findOne({
    where: { id: alertId, doctorId }
  });

  if (!alertFound) return null;

  const note = await doctor_note.create({
    alertId,
    doctorId,
    observation: body.observation,
    clinicalAssessment: body.clinicalAssessment,
    actionPlan: body.actionPlan,
    followUp: body.followUp
  });

  // marcar alerta como manejada
  await alertFound.update({
    status: 'handled',
    read: true
  });

  return note;
};

module.exports = {
  createDoctorNote
};
