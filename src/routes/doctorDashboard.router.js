const express = require('express');
const { getDashboard } = require('../controllers/doctorDashboard.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');

const doctorDashboardRouter = express.Router();

doctorDashboardRouter.route('/dashboard')
    .get(verifyJWT, verifyRoles('doctor'), getDashboard);

module.exports = doctorDashboardRouter;