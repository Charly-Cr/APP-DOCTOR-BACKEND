// Desestructuramos solo lo que necesitamos
const { approveClaim } = require('../services/payment.service');
const { user, doctor, payment } = require('../models');

const webhookYape = async (req, res) => {
  try {
    const { amount, operationNumber, phoneNumber } = req.body;

    const userData = await user.findOne({
      where: { phone: phoneNumber },
      include: [{ model: doctor }]
    });

    if (!userData || !userData.doctor) {
      return res.status(404).json({ message: "Doctor no encontrado" });
    }

    const pendingPayment = await payment.findOne({
      where: {
        doctorId: userData.doctor.id,
        status: 'pending',
        amount: parseFloat(amount) 
      }
    });

    if (!pendingPayment) {
      return res.status(400).json({ message: "No hay orden pendiente para este monto" });
    }

    // Llamada directa al método desestructurado
    const data = await approveClaim(pendingPayment.id, operationNumber);

    return res.status(200).json({ message: "Suscripción activada", data });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

module.exports = {
  webhookYape
}