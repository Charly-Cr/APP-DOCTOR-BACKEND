const { Resend } = require('resend');

// Inicializamos Resend con tu clave secreta
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  // 1. Verificamos el modo simulación desde el .env
  // (Si no existe la variable, por seguridad asumimos 'false' para que envíe)
  const isSimulation = process.env.EMAIL_SIMULATION_MODE === 'true';

  try {
    if (isSimulation) {
      // 2. LOGICA DE SIMULACIÓN: Solo loguea en consola, no llama a la API de Resend
      console.log('------------------------------------------------');
      console.log(`✨ [MODO SIMULACIÓN ACTIVADO]`);
      console.log(`📧 Para: ${options.to}`);
      console.log(`📌 Asunto: ${options.subject}`);
      console.log('------------------------------------------------');
      
      // Devolvemos un objeto similar al de Resend para que tu código no rompa
      return { success: true, data: { id: 'sim_123456789', status: 'simulated' } };
    }

    // 3. LOGICA REAL: Si el .env dice 'false', enviamos de verdad
    const data = await resend.emails.send({
      from: 'MedAlerta <alertas@medalerta.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("✅ Email enviado con éxito REAL:", data);
    return { success: true, data };

  } catch (error) {
    console.error("❌ Error en el proceso de Email:", error);
    return { success: false, error };
  }
};

module.exports = sendEmail;