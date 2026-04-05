const express = require('express');
const { create } = require('../controllers/dailyRecord.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');

const dailyRecordRouter = express.Router();

dailyRecordRouter.route('/')
 .post(verifyJWT, verifyRoles('patient'), create );

module.exports = dailyRecordRouter;
