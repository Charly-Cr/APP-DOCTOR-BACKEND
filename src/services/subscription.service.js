const { subscription, doctor } = require('../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

const activate = async (doctorId, months = 1, reference) => {
  let currentSub = await subscription.findOne({
    where: { doctorId },
    order: [['endDate', 'DESC']]
  });

  const hoy = dayjs(); // 2026-03-20
  let start;

  // LÓGICA SEGURA:
  // Si no hay suscripción O si la que hay ya venció...
  if (!currentSub || dayjs(currentSub.endDate).isBefore(hoy)) {
    start = hoy;
  } else {
    // Si tiene una activa, pero por error es de aquí a un año (2027)...
    const diferenciaAnios = dayjs(currentSub.endDate).diff(hoy, 'year');
    
    if (diferenciaAnios >= 1) {
      start = hoy; // RESET: Si detecta el error del año futuro, vuelve a hoy
    } else {
      start = dayjs(currentSub.endDate); // CONTINUIDAD: Suma al final de la actual
    }
  }

  const end = start.add(months, 'month');

  const data = {
    planType: months === 12 ? 'anual' : 'mensual',
    status: 'active',
    startDate: start.toDate(),
    endDate: end.toDate(),
    paymentReference: reference
  };

  if (currentSub) {
    await currentSub.update(data);
  } else {
    currentSub = await subscription.create({ doctorId, ...data });
  }

  await doctor.update({ subscriptionStatus: 'active' }, { where: { id: doctorId } });

  return currentSub;
};




const getStatus = async (doctorId) => {
    const activeSub = await subscription.findOne({
        where: {
            doctorId,
            status: 'active',
            endDate: { [Op.gt]: new Date() }
        },
        order: [['endDate', 'DESC']]
    });

    if (!activeSub) return null;

    const today = dayjs();
    const expiration = dayjs(activeSub.endDate);
    const daysLeft = expiration.diff(today, 'day');

    return {
        status: activeSub.status,
        endDate: activeSub.endDate,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        planType: activeSub.planType
    };
};

module.exports = { 
  activate,
  getStatus
 };