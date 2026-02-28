const express = require('express');
const { create, getMine, assignTemplateToPatient } = require('../controllers/patient.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');
const verifySubscription = require('../utils/verifySubscription');

const patientRouter = express.Router();

patientRouter.route('/')
  .post(verifyJWT, verifyRoles('doctor'),verifySubscription, create)
  // El doctor solo puede ver pacientes si está logueado, es doctor Y tiene suscripción activa
  .get(verifyJWT, verifyRoles('doctor'), verifySubscription, getMine);

 // Esta ruta significa: "En el paciente X, asigna esta plantilla"
patientRouter.route('/:id/assign-template')
  .put(verifyJWT, verifyRoles('doctor'), verifySubscription, assignTemplateToPatient);


module.exports = patientRouter;
