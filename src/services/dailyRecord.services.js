const {
  daily_record,
  daily_record_answer,
  patient
} = require('../models');

const { createMedicalAlertIfNeeded } = require('./alert.services');

const createDailyRecord = async (userId, body) => {
  const patientProfile = await patient.findOne({ where: { userId } });
  if (!patientProfile) return null;

  const record = await daily_record.create({
    patientId: patientProfile.id,
    templateId: body.templateId
  });

  const answers = body.answers.map(a => ({
    dailyRecordId: record.id,
    questionId: a.questionId,
    answer: String(a.answer)
  }));

  await daily_record_answer.bulkCreate(answers);

  await createMedicalAlertIfNeeded({
    patient: patientProfile,
    dailyRecord: record,
    answers: body.answers
  });

  return record;
};

module.exports = {
  createDailyRecord
};
