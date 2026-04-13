const catchError = require('../utils/catchError');
const { createDailyRecord, updateDailyRecordByDoctor } = require('../services/dailyRecord.services');

const create = catchError(async (req, res) => {
  const result = await createDailyRecord(req.user.id, req.body, req.user.role);
  if (!result) return res.status(404).json({ message: 'Patient not found' });
  res.status(201).json(result);
});


const update = catchError(async (req, res) => {
    const { id } = req.params;
    // Pasamos el ID y todo el cuerpo con la info médica
    const result = await updateDailyRecordByDoctor(id, req.body);

    if (!result) return res.status(404).json({ message: 'Record not found' });

    return res.json(result);
});


module.exports = {
  create,
  update
};
