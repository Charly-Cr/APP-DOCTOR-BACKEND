const { doctor, user, payment } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');

const getAllDoctorsService = async (filters = {}) => {
    return await doctor.findAll({
        where: filters,
        include: [
            { 
                model: user, 
                attributes: ['id', 'firstName', 'lastName', 'email'] 
            },
            { 
                model: payment, 
                as: 'payments', // Este alias debe coincidir con el que definiste en tus asociaciones (models/index.js)
                required: false 
            }
        ]
    });
};


const createDoctorProfile = async (userId, body, file) => {
    // 1. Validaciones rápidas
    const existing = await doctor.findOne({ where: { userId } });
    if (existing) throw new Error("Ya tienes un perfil creado");
    if (!file) throw new Error("Falta el título médico");

    // 2. Cloudinary y Data
    const uploadResult = await uploadToCloudinary(file, {
    public_id: `doctor_${userId}_${Date.now()}` // Esto genera un nombre tipo doctor_5_162765...
    });
    
    return await doctor.create({
        userId,
        specialty: body.specialty,
        licenseNumber: body.licenseNumber,
        degreeImage: uploadResult.secure_url,
        acceptedTerms: true,
        acceptedTermsAt: new Date(),
        verified: false 
    });
};



const getMyDoctorProfile = async (userId) => {
    return await doctor.findOne({
        where: { userId },
        include: 
            { model: user, 
            attributes: ['firstName', 'lastName', 'email', 'role', 'phone'] 
            },
    });
};



const updateDoctorService = async (id, body) => {
     return await doctor.update(body, { 
        where: { id }, returning: true 
    });
};


const deleteDoctorService = async (id) => {
    // 1. Busca específicamente por la llave primaria (id)
    const doctorToDelete = await doctor.findByPk(id);
    
    // Si no lo encuentra, devuelve null y el controlador mandará el 404
    if (!doctorToDelete) return null;

    // 2. Si lo encuentra, lo borra
    return await doctorToDelete.destroy();
};


module.exports = {
    createDoctorProfile, getMyDoctorProfile, getAllDoctorsService, updateDoctorService, deleteDoctorService
};