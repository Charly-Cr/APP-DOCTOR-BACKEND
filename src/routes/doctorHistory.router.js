const express = require('express');
const { getHistory, getHistoryPDF, getMyHistory, getSingleRecordPDF } = require('../controllers/doctorHistory.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');


const doctorHistoryRouter = express.Router();

doctorHistoryRouter.route('/patients/:patientId/history')
  .get(verifyJWT, verifyRoles('doctor'), getHistory );

  // Descarga el historial completo
doctorHistoryRouter.route('/patients/:patientId/history/pdf')
  .get(verifyJWT, verifyRoles('doctor'), getHistoryPDF );

// NUEVA RUTA: Descarga solo una consulta específica
doctorHistoryRouter.route('/patients/history/single/:recordId/pdf')
  .get(verifyJWT, verifyRoles('doctor'), getSingleRecordPDF);

doctorHistoryRouter.route('/my-history')
  .get(verifyJWT, verifyRoles('patient'), getMyHistory);
  


module.exports = doctorHistoryRouter;
