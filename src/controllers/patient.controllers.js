const catchError = require('../utils/catchError');
const {createPatient, getMyPatients, assignTemplate, getMyPatientProfile} = require('../services/patient.services');

const create = catchError(async (req, res) => {
  const { firstName, lastName, email, phone, acceptedTerms, mustChangePassword } = req.body;
  const doctorUserId = req.user.id;

  // Validación rápida: Si no aceptó términos, no se crea nada
  if (!acceptedTerms) {
    return res.status(400).json({ 
      message: "Debes aceptar los términos y condiciones para registrar al paciente." 
    });
  }

  const result = await createPatient(doctorUserId, {
    firstName,
    lastName,
    email,
    phone,
    passwordHash: req.passwordHash, // Viene de tu middleware
    acceptedTerms,
    mustChangePassword
  });

  return res.status(201).json(result);
});


const getMine = catchError(async (req, res) => {
  const doctorUserId = req.user.id;
  const result = await getMyPatients(doctorUserId);
  // Si el array está vacío, mandamos un mensaje claro o el []
  if (result.length === 0) return res.json({ message: "Aún no tienes pacientes", data: [] });
  return res.json(result);
});



const assignTemplateToPatient = catchError(async (req, res) => {
    const { id } = req.params;
    const { templateId } = req.body;
    const doctorUserId = req.user.id; // Del token

    const result = await assignTemplate(id, templateId, doctorUserId);
    
    if (!result) return res.status(404).json({ message: "No se pudo asignar la plantilla" });
    
    return res.json(result);
});



const getMe = catchError(async (req, res) => {
  const userId = req.user.id;

  const result = await getMyPatientProfile(userId);

  if (!result) {
    return res.status(404).json({ message: "Paciente no encontrado" });
  }

  return res.json(result);
});


module.exports = {
  create,
  getMine,
  assignTemplateToPatient,
  getMe
};
