const catchError = require('../utils/catchError');
const { getPatientHistory } = require('../services/doctorHistory.services');

const getHistory = catchError(async (req, res) => {
  const doctorUserId = req.user.id;
  const { patientId } = req.params;

  const result = await getPatientHistory(doctorUserId, patientId);

  if (result === 'FORBIDDEN') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  if (!result) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  res.json(result);
});



module.exports = {
  getHistory,
};
