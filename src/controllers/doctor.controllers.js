const catchError = require('../utils/catchError');
const { 
    createDoctorProfile, getMyDoctorProfile, getAllDoctorsService, updateDoctorService,
    deleteDoctorService
} = require('../services/doctor.services');

// @desc    Superadmin ve a todos los doctores
const getAll = catchError(async (req, res) => {
    const results = await getAllDoctorsService();
    return res.json(results);
});   



// @desc    Doctor crea su propio perfil
const create = catchError(async (req, res) => {
    const userId = req.user.id; 
    // Solo enviamos lo necesario al servicio
    const result = await createDoctorProfile(userId, req.body, req.file);
    return res.status(201).json(result);
});



// @desc    Doctor ve su propia información
const getOne = catchError(async (req, res) => {
  const userId = req.user.id; // Protegido: Viene del Token
    const result = await getMyDoctorProfile(userId); // Siempre por Token
    if (!result) return res.sendStatus(404);
    return res.json(result);
});



// @desc    Superadmin verifica o edita a un doctor por ID
const update = catchError(async (req, res) => {
    const { id } = req.params; // Seguro aquí porque la ruta pide Rol Superadmin
    // Filtramos req.body para que el admin solo cambie lo necesario (ej. verified)
    const result = await updateDoctorService(id, req.body);
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await deleteDoctorService(id);
    
    // En lugar de res.sendStatus(404), enviamos un JSON
    if (!result) {
        return res.status(404).json({ 
            message: `El doctor con ID ${id} no existe en la base de datos.` 
        });
    }
    // 204 No Content es el estándar para borrados exitosos
    return res.status(204).send(); 
});


module.exports = { create, getOne, getAll, update, remove };