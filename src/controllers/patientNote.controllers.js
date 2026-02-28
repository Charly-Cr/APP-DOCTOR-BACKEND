// controllers/patientNote.controllers.js
const catchError = require('../utils/catchError');
const { getNotesByPatient } = require('../services/patientNote.services');
const { patient } = require('../models');

const getMyNotes = catchError(async (req, res) => {
  const userId = req.user.id;

  const patientProfile = await patient.findOne({ where: { userId } });
  if (!patientProfile) return res.sendStatus(404);

  const notes = await getNotesByPatient(patientProfile.id);
  return res.json(notes);
});

module.exports = {
  getMyNotes
};
