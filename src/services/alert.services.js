const {
  alert,
  alert_detail,
  follow_up_question,
  doctor, user
} = require('../models');

const { notifyHighAlert } = require('./notification.service');

const buildSummary = (details) => {
  const pain = details.find(d => 
    d.question.toLowerCase().includes('dolor') && Number(d.answer) >= 8
  );
  // CORRECCIÓN: Buscamos si hay alguna respuesta positiva (fiebre, inflamación, etc.)
  const positiveResult = details.find(d => 
    String(d.answer).toLowerCase() === 'true' || d.answer === 'Sí'
  );

  if (pain && positiveResult) return 'Dolor severo + Síntoma positivo';
  if (pain) return 'Dolor severo reportado';
  if (positiveResult) return `Alerta: ${positiveResult.question}`; // Ej: "Alerta: ¿Fiebre?"

  return 'Evento clínico relevante';
};

const createMedicalAlertIfNeeded = async ({ patient, dailyRecord, answers }) => {
  const doctorProfile = await doctor.findByPk(patient.doctorId);
  let severity = 'low';
  const details = [];

  for (const ans of answers) {
    const question = await follow_up_question.findByPk(ans.questionId);
    if (!question) continue;

    const isTrue = String(ans.answer).toLowerCase() === 'true'; // Normalizamos el valor

    if (question.type === 'number' && Number(ans.answer) >= 8) {
      severity = 'high';
    }

    // CORRECCIÓN: Comparamos contra el string 'true'
    if (question.type === 'boolean' && isTrue) {
      if (severity !== 'high') severity = 'medium';
    }

    details.push({
      question: question.question,
      answer: String(ans.answer),
      type: question.type
    });
  }

  if (severity === 'low') return;

  const newAlert = await alert.create({
    patientId: patient.id,
    doctorId: doctorProfile.id,
    dailyRecordId: dailyRecord.id,
    severity,
    summary: buildSummary(details)
  });

  await alert_detail.bulkCreate(
    details.map(d => ({ ...d, alertId: newAlert.id }))
  );


  // >>> AQUÍ VA LA LÓGICA DEL PUNTO 1 <<<
  if (severity === 'high') {
    // Usamos 'patient' (que es el nombre que recibe tu función)
    const fullDoctorData = await doctor.findByPk(patient.doctorId, {
      include: [{ model: user }]
    });

    // Buscamos los datos del usuario del paciente para su nombre
    const fullPatientData = await user.findByPk(patient.userId);

    if (fullDoctorData?.user?.email) {

      // ENVIAMOS EL CORREO AL DOCTOR
      notifyHighAlert(
        fullDoctorData.user.email,
        fullDoctorData.user.firstName,
        `${fullPatientData.firstName} ${fullPatientData.lastName}`,
        newAlert.summary
      );
    }
  }


};

const markAsSeen = async (id, doctorId) => {
  return await alert.update(
    { status: 'seen', read: true },
    { where: { id, doctorId }, returning: true }
  );
};

const markAsHandled = async (id, doctorId) => {
  return await alert.update(
    { status: 'handled' },
    { where: { id, doctorId }, returning: true }
  );
};

module.exports = {
  createMedicalAlertIfNeeded,
  markAsSeen,
  markAsHandled
};
