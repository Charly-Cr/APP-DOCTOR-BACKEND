const { subscription, doctor } = require('../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

const activate = async (doctorId, months = 1, reference) => {
  // 1. Buscamos si el doctor ya tiene una suscripción (activa o vencida)
  let currentSub = await subscription.findOne({
    where: { doctorId },
    order: [['endDate', 'DESC']]
  });

  // 2. Calculamos las fechas
  // Si tiene suscripción activa y no ha vencido, empezamos desde el endDate actual
  const start = currentSub && dayjs(currentSub.endDate).isAfter(dayjs()) 
                ? dayjs(currentSub.endDate) 
                : dayjs();
  
  const end = start.add(months, 'month');

  // 3. ACTUALIZAMOS o CREAMOS (Upsert lógico)
  // En lugar de crear un registro nuevo que sature la DB, mantenemos uno solo por doctor
  if (currentSub) {
    await currentSub.update({
      planType: months === 12 ? 'anual' : 'mensual',
      status: 'active',
      startDate: start.toDate(), // Mantenemos la continuidad
      endDate: end.toDate(),     // Extendemos la fecha
      paymentReference: reference // Guardamos la nueva referencia de pago
    });
  } else {
    currentSub = await subscription.create({
      doctorId,
      planType: months === 12 ? 'anual' : 'mensual',
      status: 'active',
      startDate: start.toDate(),
      endDate: end.toDate(),
      paymentReference: reference
    });
  }

  // 4. Sincronizar el estado en el modelo doctor
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