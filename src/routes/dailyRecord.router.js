const express = require('express');
const { create, update } = require('../controllers/dailyRecord.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');

const dailyRecordRouter = express.Router();

// El paciente CREA el registro (Alerta)
dailyRecordRouter.route('/')
 .post(verifyJWT, verifyRoles('doctor', 'patient'), create );

// El médico ACTUALIZA el registro con la evaluación profesional
dailyRecordRouter.route('/:id')
 .patch(verifyJWT, verifyRoles('doctor'), update);

module.exports = dailyRecordRouter;
