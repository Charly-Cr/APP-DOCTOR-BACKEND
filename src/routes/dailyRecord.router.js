const express = require('express');
const { create } = require('../controllers/dailyRecord.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');
const checkActiveSubscription = require('../middlewares/checkActiveSubscription.middlewares');

const dailyRecordRouter = express.Router();

dailyRecordRouter.route('/')
 .post(verifyJWT, verifyRoles('patient'), checkActiveSubscription, create );

module.exports = dailyRecordRouter;
