const catchError = require('../utils/catchError');
const { alert, alert_detail, patient, user, doctor } = require('../models');
const { markAsSeen, markAsHandled } = require('../services/alert.services');

const getDoctorAlerts = catchError(async (req, res) => {
  const userId = req.user.id;

  const doctorProfile = await doctor.findOne({ where: { userId } });
  if (!doctorProfile) return res.sendStatus(404);

  const alerts = await alert.findAll({
    where: { doctorId: doctorProfile.id },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: alert_detail
      },
      {
        model: patient,
        include: [{ model: user }]
      }
    ]
  });

  res.json(alerts);
});

const seen = catchError(async (req, res) => {
  const { id } = req.params;

  const doctorProfile = await doctor.findOne({
    where: { userId: req.user.id }
  });

  if (!doctorProfile) return res.sendStatus(403);

  const result = await markAsSeen(id, doctorProfile.id);

  if (result[0] === 0) return res.sendStatus(404);

  return res.json({ message: 'Alerta marcada como vista' });
});

const handled = catchError(async (req, res) => {
  const { id } = req.params;

  const doctorProfile = await doctor.findOne({
    where: { userId: req.user.id }
  });

  if (!doctorProfile) return res.sendStatus(403);

  const result = await markAsHandled(id, doctorProfile.id);

  if (result[0] === 0) return res.sendStatus(404);

  return res.json({ message: 'Alerta marcada como atendida' });
});

module.exports = {
  getDoctorAlerts,
  seen, 
  handled
};
