const express = require('express');
const { getDoctorAlerts, seen, handled } = require('../controllers/alert.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');

const alertRouter = express.Router();

alertRouter.route('/')
  .get(verifyJWT, verifyRoles('doctor'), getDoctorAlerts );

alertRouter.route('/:id/seen')
  .patch(verifyJWT, verifyRoles('doctor'), seen);

alertRouter.route('/:id/handled')
  .patch(verifyJWT, verifyRoles('doctor'), handled);

module.exports = alertRouter;
