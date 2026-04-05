const { doctor } = require('../models');
const catchError = require('../utils/catchError');

const checkActiveSubscription = catchError(async (req, res, next) => {
    let doctorId = null;

    // 1. Identificar de quién depende la suscripción
    if (req.user.role === 'doctor') {
        // Si es el doctor, buscamos su propio perfil
        const doctorProfile = await doctor.findOne({ where: { userId: req.user.id } });
        doctorId = doctorProfile?.id;
    } else if (req.user.role === 'patient') {
        // Si es el paciente, buscamos el doctor que lo creó (esta relación debe estar en tu tabla de pacientes)
        // Nota: Asegúrate de que req.user traiga el doctorId asignado al paciente
        doctorId = req.user.doctorId; 
    }

    if (!doctorId) return res.status(403).json({ message: "No se encontró un doctor responsable." });

    // 2. Verificar estado de suscripción
    const doctorData = await doctor.findByPk(doctorId);

    // Lógica: Si la suscripción no es 'active', bloqueamos la acción
    if (!doctorData || doctorData.subscriptionStatus !== 'active') {
        return res.status(403).json({
            message: "Acceso restringido. La suscripción del doctor no está activa.",
            code: "SUBSCRIPTION_INACTIVE"
        });
    }

    next();
});

module.exports = checkActiveSubscription;