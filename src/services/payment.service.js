const { payment } = require('../models');
const crypto = require('crypto');
const { activate } = require('./subscription.service');
const { uploadToCloudinary } = require('../utils/cloudinary');
const sendEmail = require('../utils/sendEmail');
const { doctor, user } = require('../models');

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

    // 1. Subimos la imagen a una carpeta específica en Cloudinary
    const uploadResult = await uploadToCloudinary(file, {
        folder: 'vouchers_pagos',
        public_id: `voucher_${claim.claimCode}`
    });

    // 2. Actualizamos la orden en la DB con la URL y un estado de "En revisión"
    await claim.update({
        voucherImage: uploadResult.secure_url,
        status: 'pending' // O puedes crear un estado 'on_review' si prefieres
    });

    
        // 3. Buscamos el pago YA actualizado pero TRAEMOS los nombres del doctor y usuario
        const updatedPayment = await payment.findByPk(paymentId, {
        include: [
        {
            model: doctor,
            include: [{ model: user, attributes: ['firstName', 'lastName'] }]
        }
    ]
});

    // 3. Notificación: Usamos process.env.EMAIL para recibirlo tú mismo
    await sendEmail({
    to: process.env.EMAIL, // Tu correo de administrador [cite: 2026-01-03]
    subject: `💎 PREMÍUM: Nuevo Ingreso de ${updatedPayment.doctor?.user?.firstName || 'Doctor'} - ${updatedPayment.claimCode}`,
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; padding: 40px; color: #1a1a1a;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-top: 8px solid #000000;">
                
                <div style="padding: 30px; text-align: center; background: #1a1a1a; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">NOTIFICACIÓN DE ELITE</h1>
                    <p style="opacity: 0.8; margin-top: 5px;">Sistema de Pagos DoctorApp</p>
                </div>

                <div style="padding: 40px;">
                    <h2 style="color: #1a1a1a; margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Detalles del Depósito</h2>
                    
                    <p style="font-size: 16px;">👤 <strong>Doctor:</strong> <span style="color: #4f46e5;">${updatedPayment.doctor?.user?.firstName} ${updatedPayment.doctor?.user?.lastName}</span></p>
                    <p style="font-size: 16px;">💰 <strong>Monto Recibido:</strong> <span style="color: #22c55e; font-weight: bold;">S/ ${updatedPayment.amount}</span></p>
                    <p style="font-size: 16px;">📅 <strong>Plan Solicitado:</strong> <span style="text-transform: uppercase; font-weight: bold;">${updatedPayment.planType}</span></p>
                    <p style="font-size: 16px;">🔑 <strong>Código de Operación:</strong> ${updatedPayment.claimCode}</p>
                    
                    <div style="margin-top: 40px; text-align: center;">
                        <a href="${updatedPayment.voucherImage}" 
                           style="background-color: #ffffff; color: #1a1a1a; border: 2px solid #1a1a1a; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px; display: inline-block;">
                           🔍 REVISAR VOUCHER
                        </a>
                    </div>
                </div>

                <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="font-size: 13px; color: #6b7280; margin: 0;">Inversión en proceso de verificación. Gestión de activos v1.0</p>
                </div>
            </div>
        </div>
    `
}).catch(err => console.error("Error en notificación admin:", err));

    return updatedPayment;
};

module.exports = { createClaim, approveClaim, uploadVoucherService };