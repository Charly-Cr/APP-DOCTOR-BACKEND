const sendEmail = require('../utils/sendEmail');

// NOTIFICCACIONES DE ALERTAS CRITICAS PARA EL DOCTOR
const notifyHighAlert = async (doctorEmail, doctorName, patientName, summary) => {
  await sendEmail({
    to: doctorEmail,
    subject: `⚠️ ALERTA CRÍTICA: ${patientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; border: 3px solid #ff0000; padding: 20px; border-radius: 15px;">
        <h1 style="color: #d32f2f;">¡URGENTE DR. ${doctorName.toUpperCase()}!</h1>
        <p style="font-size: 16px;">El paciente <strong>${patientName}</strong> ha registrado síntomas de alta severidad.</p>
        <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Resumen del reporte:</strong><br>
          ${summary}
        </div>
        <p>Por favor, revise su panel de control a la brevedad.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">
        Este es un mensaje automático. Por favor, no responda a este correo. 
        Gestione la alerta desde su panel de control de MedAlerta.
        </p>
        </div>
    `
  });
};

// NOTIFICACIONES ASIGNADOS PARA EL PACIENTE
const notifyPatientAssignment = async (patientEmail, patientName, doctorName, templateName) => {
  await sendEmail({
    to: patientEmail,
    subject: `📋 Plan de Seguimiento: Dr. ${doctorName}`,
    html: `
      <div style="font-family: sans-serif; border-top: 8px solid #3b82f6; padding: 20px; background-color: #f8fafc;">
        <h2 style="color: #1e40af;">¡Hola, ${patientName}!</h2>
        <p>Tu médico, el <strong>Dr. ${doctorName}</strong>, ha iniciado un plan de seguimiento digital para tu salud.</p>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <strong>Seguimiento asignado:</strong> ${templateName}
        </div>
        <p>A partir de mañana, recuerda ingresar a la app para registrar cómo te sientes. ¡Tu reporte diario nos ayuda a cuidarte mejor!</p>
        <p style="font-size: 13px; color: #64748b;">Este es un servicio automático de DoctorApp.</p>
      </div>
      <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
      <p><strong>Nota importante:</strong> Este correo es solo informativo.</p>
      <p>No responda a este mensaje. Si tiene alguna duda sobre su tratamiento, comuníquese directamente con el consultorio del doctor.</p>
      </div>
    `
  });
};


// NOTIFICACIONES DE NOTAS DEL DOCTOR PARA EL PACIENTE
const notifyDoctorNote = async (patientEmail, patientName, doctorName, actionPlan) => {
  await sendEmail({
    to: patientEmail,
    subject: `✅ Tu Dr. ${doctorName} ha revisado tu reporte`,
    html: `
      <div style="font-family: sans-serif; border-top: 8px solid #10b981; padding: 20px; background-color: #f0fdf4;">
        <h2 style="color: #065f46;">¡Hola, ${patientName}!</h2>
        <p>Tu médico, el <strong>Dr. ${doctorName}</strong>, ha revisado tu último reporte de salud y te ha dejado una indicación.</p>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #d1fae5; margin: 20px 0;">
            <strong>Indicación médica:</strong><br>
            <p style="font-size: 16px; color: #111827;">"${actionPlan}"</p>
        </div>
        <p>Por favor, ingresa a la app para ver el detalle completo de tu seguimiento.</p>
        <p style="font-size: 13px; color: #6b7280;">Este es un servicio automático de MedAlerta.</p>
      </div>
    `
  });
};



// NOTIFICACIÓN PARA EL ADMINISTRADOR CUANDO UN DOCTOR ENVIA SU BOUCHER DE PAGO 
const notifyAdminNewPayment = async (adminEmail, doctorFullName, amount, planType, claimCode, voucherImage) => {
  await sendEmail({
    to: adminEmail, // Ahora viene de la DB (adminProfile.email)
    subject: `💎 PREMÍUM: Nuevo Ingreso - ${claimCode}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border-top: 8px solid #000; background-color: #fcfcfc;">
        <h2 style="color: #000; letter-spacing: 1px;">NOTIFICACIÓN ELITE</h2>
        <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;">
        
        <p style="font-size: 15px;">Se ha recibido un nuevo comprobante de pago para revisar:</p>
        
        <div style="background-color: #fff; border: 1px solid #eee; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Doctor:</strong> ${doctorFullName}</p>
          <p style="margin: 5px 0;"><strong>Monto:</strong> S/ ${amount}</p>
          <p style="margin: 5px 0;"><strong>Plan:</strong> ${planType.toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Código:</strong> <span style="color: #2563eb; font-family: monospace;">${claimCode}</span></p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${voucherImage}" 
             style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">
             🔍 REVISAR VOUCHER AHORA
          </a>
        </div>

        <p style="font-size: 11px; color: #888; margin-top: 40px; text-align: center;">
          Este es un aviso automático del sistema MedAlerta.
        </p>
      </div>`
  });
};


module.exports = { notifyHighAlert, notifyPatientAssignment, notifyDoctorNote, notifyAdminNewPayment };