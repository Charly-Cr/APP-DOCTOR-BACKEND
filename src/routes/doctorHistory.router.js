const express = require('express');
const { getHistory, getHistoryPDF, getMyHistory } = require('../controllers/doctorHistory.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');


const doctorHistoryRouter = express.Router();

doctorHistoryRouter.route('/patients/:patientId/history')
  .get(verifyJWT, verifyRoles('doctor'), getHistory );

doctorHistoryRouter.route('/patients/:patientId/history/pdf')
  .get(verifyJWT, verifyRoles('doctor'), getHistoryPDF );

doctorHistoryRouter.route('/my-history')
  .get(verifyJWT, verifyRoles('patient'), getMyHistory);
  


module.exports = doctorHistoryRouter;
