const cron = require('node-cron');
const { patient, daily_record, user, doctor } = require('../models');
const { Op } = require('sequelize'); // Ahora sí lo usaremos abajo
const sendEmail = require('./sendEmail');

const initCronJobs = () => {
    // Para probarlo AHORA: cambia '0 9 * * *' por '* * * * *' (cada minuto)
    // para produccion : '0 9 * * *'
    // para pruebas : '* * * * *'
    cron.schedule('0 9 * * *', async () => {
        console.log('🤖 Ejecutando recordatorio diario de reportes...');

        try {
            // Obtenemos el inicio y fin del día actual para el filtro
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // 1. Buscamos pacientes e intentamos incluir el registro de HOY
            const patientsToRemind = await patient.findAll({
                include: [
                    { 
                        model: user, 
                        attributes: ['email', 'firstName'] 
                    },
                    {
                        model: daily_record,
                        required: false, // Left Join: queremos al paciente aunque no tenga record
                        where: {
                            createdAt: {
                                [Op.between]: [startOfDay, endOfDay] // 👈 AQUÍ usamos Op correctamente
                            }
                        }
                    },
                    {
                        model: doctor,
                        include: { 
                            model: user, 
                            attributes: ['lastName'] 
                        }
                    }
                ]
            });

            // 2. Filtramos: Si daily_records está vacío, es que no reportó hoy
            const lazyPatients = patientsToRemind.filter(p => 
                !p.daily_records || p.daily_records.length === 0
            );



            // 3. Envío de correos 
            for (const p of lazyPatients) {
            if (p.user?.email) {
            try {
            // Llamamos a nuestra función inteligente
            await sendEmail({
                to: p.user.email,
                subject: `📌 Recordatorio: Tu reporte de salud - MedAlerta`,
                html: `<h3>¡Hola ${p.user.firstName}! 👋</h3>
                <p>Recordatorio : Llena tu reporte de seguimiento diario ATTE: MEDALERTA </p>` 
            });

            // 🔥 ESPERA DE SEGURIDAD: 300 milisegundos
            // Esto evita que Resend se queje por enviar muy rápido
            await new Promise(resolve => setTimeout(resolve, 300));

        } catch (emailErr) {
            console.error(`Error con ${p.user.email}:`, emailErr.message);
        }
        }
        }
            
            console.log(`✅ Proceso terminado. Se enviaron ${lazyPatients.length} recordatorios.`);
        } catch (error) {
            console.error('❌ Error crítico en el Cron Job:', error);
        }
    }, {
        scheduled: true,
        timezone: "America/Lima"
    });
};

module.exports = { initCronJobs };