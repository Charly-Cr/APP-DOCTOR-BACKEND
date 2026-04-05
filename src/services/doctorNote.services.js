const { doctor_note, alert, patient, user, doctor } = require('../models');
const { notifyDoctorNote } = require('./notification.service');


const createDoctorNote = async (doctorId, alertId, body) => {
  // 1. Buscamos la alerta incluyendo al paciente y su usuario (para el email)
  const alertFound = await alert.findOne({
    where: { id: alertId, doctorId },
    include: [
      { 
        model: patient, 
        include: { model: user, attributes: ['email', 'firstName'] } 
      },
      {
        model: doctor,
        include: { model: user, attributes: ['lastName'] } // Para sacar "Dr. Perez"
      }
    ]
  });
  
  if (!alertFound) return null;
  
  // 2. Crear la nota
  const note = await doctor_note.create({
    alertId,
    doctorId,
    observation: body.observation,
    clinicalAssessment: body.clinicalAssessment,
    actionPlan: body.actionPlan,
    followUp: body.followUp
  });

  
  // 3. Marcar alerta como manejada (Tu lógica original)
  await alertFound.update({
    status: 'handled',
    read: true
  });


  // 4. DISPARAR NOTIFICACIÓN 
  if (alertFound.patient?.user?.email) {
    const pEmail = alertFound.patient.user.email;
    const pName = alertFound.patient.user.firstName;
    const dName = alertFound.doctor?.user?.lastName || "Especialista";

    // Llamamos a la función que ya sabemos que funciona
    notifyDoctorNote(pEmail, pName, dName, body.actionPlan); 
  }

  return note;
};


module.exports = {
  createDoctorNote
};
