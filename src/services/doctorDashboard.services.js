const { patient, user, daily_record, alert, doctor_note, doctor } = require('../models');
const { Op } = require('sequelize');

const getDoctorDashboard = async (doctorUserId) => {
    // 1. Obtener el perfil del doctor (Validación de seguridad con Op)
    const doctorProfile = await doctor.findOne({ 
        where: { 
            [Op.and]: [{ userId: doctorUserId }] // Uso de Op para validación robusta
        } 
    });
    
    if (!doctorProfile) return null;

    // 2. Obtener solo los pacientes que pertenecen a ESTE doctor
    const patients = await patient.findAll({
        where: { 
            doctorId: doctorProfile.id, 
            status: { [Op.eq]: 'active' } // Uso de Op.eq para asegurar el estado
        },
        include: [
            {
                model: user,
                attributes: ['firstName', 'lastName', 'email']
            },
            {
                model: daily_record,
                limit: 1,
                order: [['recordDate', 'DESC']],
                include: [
                    {
                        model: alert,
                        include: [{ model: doctor_note }]
                    }
                ]
            }
        ]
    });

    const today = new Date().toISOString().split('T')[0];

    return patients.map(p => {
        const lastRecord = p.daily_records[0] || null;
        const lastAlert = lastRecord?.alert || null;
        const hasNote = !!lastAlert?.doctor_note;

        let status = 'stable'; 
        if (!lastRecord || lastRecord.recordDate !== today) {
            status = 'inactive';
        } else if (lastAlert && !hasNote) {
            status = 'critical';
        } else if (lastAlert && hasNote) {
            status = 'handled';
        }

        return {
            patientId: p.id,
            fullName: `${p.user.firstName} ${p.user.lastName}`,
            status,
            lastReportDate: lastRecord ? lastRecord.recordDate : 'Nunca',
            alertSeverity: lastAlert ? lastAlert.severity : null,
            pendingAction: (lastAlert && !hasNote)
        };
    });
};

module.exports = { getDoctorDashboard };