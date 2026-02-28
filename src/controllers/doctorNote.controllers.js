const catchError = require('../utils/catchError');
const { createDoctorNote } = require('../services/doctorNote.services');
const { doctor } = require ('../models')

const create = catchError(async (req, res) => {
  const userId = req.user.id;
  const { alertId } = req.params;

  const doctorProfile = await doctor.findOne({ where: { userId } });
    if (!doctorProfile) return res.sendStatus(404);

  const note = await createDoctorNote(doctorProfile.id, alertId, req.body);
  if (!note) return res.sendStatus(404);

  return res.status(201).json(note);
});

module.exports = {
  create
};
