const catchError = require('../utils/catchError');
const {createTemplate, getMyTemplates, getPatientAssignedTemplate} = require('../services/followUpTemplate.services');

const create = catchError(async (req, res) => {
  const result = await createTemplate(req.user.id, req.body);
  if (!result) return res.status(404).json({ message: 'Doctor not found' });
  res.status(201).json(result);
});

const getMine = catchError(async (req, res) => {
  const result = await getMyTemplates(req.user.id);
  res.json(result);
});

const getAssigned = catchError(async (req, res) => {
  const result = await getPatientAssignedTemplate(req.user.id);
  if (!result) return res.status(404).json({ message: 'No assigned template found' });
  res.json(result);
});

module.exports = {
  create,
  getMine,
  getAssigned
};
