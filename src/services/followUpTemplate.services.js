const {follow_up_template, follow_up_question, doctor, patient} = require('../models');

const createTemplate = async (userId, body) => {
  const doctorProfile = await doctor.findOne({
    where: { userId }
  });

  if (!doctorProfile) return null;

  // 1. Creamos la cabecera de la plantilla
  const template = await follow_up_template.create({
    doctorId: doctorProfile.id,
    title: body.title
  });

  // 2. Si vienen preguntas, las procesamos
  if (body.questions?.length) {
    const questionsToCreate = body.questions.map(q => ({
      question: q.question,
      type: q.type,
      required: q.required ?? true, // Si el front no lo envía, por defecto es true
      templateId: template.id
    }));

    await follow_up_question.bulkCreate(questionsToCreate);
  }

  // 3. Retornamos la plantilla (puedes incluir las preguntas si quieres devolver todo de una vez)
  // RE-BUSCAMOS para que el Front reciba TODO el objeto completo
  return await follow_up_template.findByPk(template.id, {
    include: [{ model: follow_up_question, as: 'questions' }]
  });
};

const getMyTemplates = async (userId) => {
  const doctorProfile = await doctor.findOne({ where: { userId } });
  if (!doctorProfile) return [];

  return await follow_up_template.findAll({
    where: { doctorId: doctorProfile.id },
    include: [{
      model: follow_up_question,
      as: 'questions' // <--- Usamos el mismo alias que en la asociación
    }]
  });
};



const getPatientAssignedTemplate = async (userId) => {
  // 1. Buscamos el perfil de paciente vinculado al usuario logueado
  const patientProfile = await patient.findOne({
    where: { userId }
  });

  if (!patientProfile || !patientProfile.assignedTemplateId) return null;

  // 2. Traemos la plantilla que tiene asignada con sus preguntas
  return await follow_up_template.findByPk(patientProfile.assignedTemplateId, {
    include: [{ 
      model: follow_up_question,
      as: 'questions' // <--- ESTO ES LO QUE TE FALTABA
    }]
  });
};

module.exports = {
  createTemplate,
  getMyTemplates,
  getPatientAssignedTemplate
};
