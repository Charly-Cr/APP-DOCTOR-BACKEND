const catchError = require('../utils/catchError');
const { createDailyRecord } = require('../services/dailyRecord.services');

const create = catchError(async (req, res) => {
  const result = await createDailyRecord(req.user.id, req.body);
  if (!result) return res.status(404).json({ message: 'Patient not found' });
  res.status(201).json(result);
});

module.exports = {
  create
};
