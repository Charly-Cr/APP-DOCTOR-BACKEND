const { createClaim, approveClaim, uploadVoucherService } = require('../services/payment.service');
const catchError = require('../utils/catchError');
const { doctor } = require('../models');

const create = catchError(async (req, res) => {
    const userId = req.user.id; 

    const doctorProfile = await doctor.findOne({ where: { userId } });
    
    if (!doctorProfile) {
        return res.status(403).json({ 
            message: "No se encontró un perfil de doctor para este usuario." 
        });
    }

    const { planType } = req.body;

    // 2. Validación de plan
    const validPlans = ['mensual', 'anual'];
    if (!validPlans.includes(planType)) {
        return res.status(400).json({ message: "Use 'mensual' o 'anual'." });
    }
    
    // 3. Pasamos el doctorProfile.id al servicio
    const result = await createClaim(doctorProfile.id, planType);
    
    return res.status(201).json(result);
});

const approve = catchError(async (req, res) => {
    const { id } = req.params;
    // Si no viene en el body, le ponemos un string por defecto o null
    const externalReference = req.body.externalReference || "MANUAL_ADMIN_APPROVE"; 
    
    const result = await approveClaim(id, externalReference);
    
    if (!result) {
        return res.status(404).json({ 
            message: "El pago no existe, ya fue procesado o no se pudo activar la suscripción." 
        });
    }

    // Enviamos respuesta clara para que Swal.fire cierre el loader
    return res.json({ 
        message: "¡Pago aprobado con éxito!", 
        result 
    });
});


const uploadVoucher = catchError(async (req, res) => {
    const { id } = req.params; // ID del pago
    const file = req.file; // El archivo que viene de Multer

    if (!file) {
        return res.status(400).json({ message: "Debes adjuntar la imagen del comprobante." });
    }

    const result = await uploadVoucherService(id, file);

    return res.json({
        message: "Comprobante recibido. Tu pago está siendo verificado.",
        data: result
    });
});


module.exports = { 
    create, 
    approve,
    uploadVoucher
 }