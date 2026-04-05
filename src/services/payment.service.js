const crypto = require('crypto');
const { activate } = require('./subscription.service');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { doctor, user, payment } = require('../models');
const { notifyAdminNewPayment } = require('./notification.service');

/**
 * FLUJO DE PAGO:
 * 1. createClaim: Crea la orden 'pending'.
 * 2. approveClaim: Valida el pago -> Llama a subscription.service para dar acceso.
 * 3. uploadVoucherService: Guarda la imagen del boucher.
 */


const createClaim = async (doctorId, planType) => {
    const amount = planType === 'mensual' ? 49.00 : 490.00;
    const claimCode = `PAY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const newPayment = await payment.create({
        doctorId,
        planType,
        amount,
        claimCode,
        status: 'pending',
    });

    // Retornamos el pago + los datos de transferencia "Pro"
    return {
        ...newPayment.toJSON(),
        paymentInstructions: {
            yape: {
                number: process.env.PAYMENT_YAPE_NUMBER,
                name: process.env.PAYMENT_YAPE_NAME,
                qrCodeUrl: process.env.PAYMENT_YAPE_QR
            },
            bankTransfer: {
                bank: process.env.PAYMENT_BANK_NAME,
                accountNumber: process.env.PAYMENT_BANK_ACCOUNT,
                cci: process.env.PAYMENT_BANK_CCI,
                owner: process.env.PAYMENT_BANK_OWNER
            }
        }
    };
};

const approveClaim = async (claimId, externalReference) => {
    const claim = await payment.findByPk(claimId);
    if (!claim || claim.status !== 'pending') return null;

    await claim.update({ 
        status: 'approved',
        externalReference,
    });

    const months = claim.planType === 'mensual' ? 1 : 12;
    
    // Llamada directa al método desestructurado
    await activate(claim.doctorId, months, externalReference);

    return claim;
};


const uploadVoucherService = async (paymentId, file) => {
    const claim = await payment.findByPk(paymentId);
    if (!claim) throw new Error("Orden de pago no encontrada");

    // 1. Buscamos al Administrador para tener su correo
    const adminProfile = await user.findOne({ where: { role: 'superadmin' } });
    if (!adminProfile) throw new Error("No hay administrador configurado en la DB");
    
    // 2. Subimos la imagen a una carpeta específica en Cloudinary
    const uploadResult = await uploadToCloudinary(file, {
        folder: 'vouchers_pagos',
        public_id: `voucher_${claim.claimCode}`
    });

    // 3. Actualizamos la orden en la DB con la URL y un estado de "En revisión"
    await claim.update({
        voucherImage: uploadResult.secure_url,
        status: 'pending' // O puedes crear un estado 'on_review' si prefieres
    });

    
        // 4. Buscamos el pago YA actualizado pero TRAEMOS los nombres del doctor y usuario
        const updatedPayment = await payment.findByPk(paymentId, {
        include: [
        {
            model: doctor,
            include: [{ model: user, attributes: ['firstName', 'lastName'] }]
        }
    ]
});

    // 5. ENVÍO SEGURO: Solo si existe el adminProfile
    if (adminProfile && adminProfile.email) {
        // Usamos await para asegurar que el proceso de envío se complete
        await notifyAdminNewPayment(
            adminProfile.email, 
            // doctorFullName esta desestructurado aqui en la siguiente linea
            `${updatedPayment.doctor.user.firstName} ${updatedPayment.doctor.user.lastName}`,
            updatedPayment.amount,
            updatedPayment.planType,
            updatedPayment.claimCode,
            updatedPayment.voucherImage
        );
    } else {
        console.error("⚠️ No se envió correo: Admin no encontrado o sin email.");
    }

    return updatedPayment;
};


module.exports = { createClaim, approveClaim, uploadVoucherService };