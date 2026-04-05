const express = require('express');
const { create, getMine, assignTemplateToPatient, getMe } = require('../controllers/patient.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');
const verifySubscription = require('../utils/verifySubscription');
const { passwordMiddlewares } = require('../middlewares/password.middlewares');
const { validate } = require('../middlewares/validate.middleware');

const patientRouter = express.Router();

patientRouter.route('/')
  .post(verifyJWT, verifyRoles('doctor'),verifySubscription, passwordMiddlewares, create)
  // El doctor solo puede ver pacientes si está logueado, es doctor Y tiene suscripción activa
  .get(verifyJWT, verifyRoles('doctor'), verifySubscription, getMine);

  patientRouter.route('/me')
  .get(verifyJWT, verifyRoles('patient'), getMe )


 // Esta ruta significa: "En el paciente X, asigna esta plantilla"
patientRouter.route('/:id/assign-template')
  .put(verifyJWT, verifyRoles('doctor'), verifySubscription, assignTemplateToPatient);


module.exports = patientRouter;
