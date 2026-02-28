const { getStatus } = require('../services/subscription.service');

const checkActiveSubscription = async (req, res, next) => {
  // Obtenemos el ID del doctor asociado (ya que la suscripción es del doctor)
  // Si el usuario es paciente, necesitamos el doctorId de su perfil
  const doctorId = req.user.doctor?.id || req.user.patient?.doctorId;

  if (!doctorId) {
    return res.status(403).json({ message: 'No se identificó un doctor asociado a este usuario.' });
  }

  const active = await getStatus(doctorId);

  // Verificamos que exista la suscripción y que tenga días restantes
  if (!active || active.daysLeft <= 0) {
    return res.status(403).json({
      message: 'Acceso denegado: El doctor no tiene una suscripción activa.'
    });
  }

  next();
};

module.exports = checkActiveSubscription;