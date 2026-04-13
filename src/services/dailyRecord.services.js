const {
  daily_record,
  daily_record_answer,
  patient
} = require('../models');

const { createMedicalAlertIfNeeded } = require('./alert.services');

const createDailyRecord = async (userId, body, role) => {

  let activePatientProfile;

  // 1. Identificamos el perfil del paciente correctamente
  if (role === 'doctor') {
    // Si es doctor, buscamos el perfil del paciente usando el ID enviado desde el front
    activePatientProfile = await patient.findByPk(body.patientId);
  } else {
    // Si es paciente, lo buscamos por su userId (como estaba originalmente)
    activePatientProfile = await patient.findOne({ where: { userId } });
  }

  if (!activePatientProfile) return null;

  // 1. Desestructuramos los nuevos campos del body
  const { 
    templateId, 
    reason_for_consultation, 
    illness_time, 
    vital_signs, 
    physical_exam, 
    diagnosis, 
    treatment,
    answers: answersData 
  } = body;


  // LÓGICA DE TIPO: 
  // Si el rol es doctor, es una CONSULTA. 
  // Si no, es una ALERTA (porque viene del triaje/cuestionario del paciente).
  const recordType = (role === 'doctor') ? 'CONSULTA' : 'ALERTA';

  // 2. Creamos el record incluyendo los nuevos campos clínicos
  const record = await daily_record.create({
    patientId: activePatientProfile.id,
    templateId: templateId,
    type: recordType,
    reason_for_consultation, 
    illness_time,           
    vital_signs: vital_signs || {},   
    physical_exam: physical_exam || {}, 
    diagnosis: diagnosis || [],       
    treatment: treatment || []        
  });

  // 3. Guardamos las respuestas del cuestionario (lo que ya tenías)
  if (answersData && answersData.length > 0) {
    const answers = answersData.map(a => ({
      dailyRecordId: record.id,
      questionId: a.questionId,
      answer: String(a.answer)
    }));
    await daily_record_answer.bulkCreate(answers);
  }

  // 4. Procesamos alertas (pasando el record con su nueva data)
  await createMedicalAlertIfNeeded({
    patient: activePatientProfile,
    dailyRecord: record,
    answers: answersData || []
  });

  return record;
};


const updateDailyRecordByDoctor = async (id, medicalData) => {
    // 1. Buscamos el registro
    const record = await daily_record.findByPk(id);
    if (!record) return null;

    // 2. Actualizamos y forzamos el guardado
    await record.update({
        type: 'CONSULTA',
        reason_for_consultation: medicalData.reason_for_consultation,
        illness_time: medicalData.illness_time,
        vital_signs: medicalData.vital_signs,
        physical_exam: medicalData.physical_exam,
        diagnosis: medicalData.diagnosis,
        treatment: medicalData.treatment
    });

    // 3. Recargamos para confirmar que se guardó en la DB
    return await record.reload();
};

module.exports = {
  createDailyRecord,
  updateDailyRecordByDoctor
};
