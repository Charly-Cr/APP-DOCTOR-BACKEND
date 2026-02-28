const express = require('express');
const { create, getMine, getAssigned } = require('../controllers/followUpTemplate.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');

const followUpTemplateRouter = express.Router();

// NUEVA: Ruta para el Paciente
followUpTemplateRouter.route('/my-assigned')
  .get(verifyJWT, verifyRoles('patient'), getAssigned);

followUpTemplateRouter.route('/')
  .post(verifyJWT, verifyRoles('doctor'), create)
  .get(verifyJWT, verifyRoles('doctor'), getMine);



module.exports = followUpTemplateRouter;
