// services/patientNote.services.js
const {
  doctor_note,
  alert,
  daily_record
} = require('../models');

const getNotesByPatient = async (patientId) => {
  return await doctor_note.findAll({
    include: [
      {
        model: alert,
        required: true,
        include: [
          {
            model: daily_record,
            where: { patientId }
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

module.exports = {
  getNotesByPatient
};
