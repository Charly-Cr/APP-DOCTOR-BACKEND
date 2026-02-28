const { subscription, doctor } = require('../models');
const { Op } = require('sequelize');

const verifySubscription = async (req, res, next) => {
    // 1. Usamos el id que viene del verifyJWT
    const userId = req.user.id; 
    
    // Buscamos el doctor. Usamos include si queremos más info, pero con el ID basta.
    const doctorProfile = await doctor.findOne({ where: { userId } });

    if (!doctorProfile) {
        return res.status(403).json({ message: "No tienes un perfil de doctor creado." });
    }

    // 2. Verificamos la suscripción en la tabla dedicada
    const activeSub = await subscription.findOne({
        where: {
            doctorId: doctorProfile.id,
            status: 'active',
            endDate: { [Op.gt]: new Date() } 
        }
    });

    if (!activeSub) {
        return res.status(403).json({ 
            message: "Acceso denegado. Tu suscripción no está activa o ha vencido." 
        });
    }

    // 💡 Pro-tip: Guardamos el doctorId para que los siguientes controllers lo usen
    req.doctorId = doctorProfile.id; 
    next();
};

module.exports = verifySubscription;