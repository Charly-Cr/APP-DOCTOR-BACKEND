const { requestPayout } = require('../controllers/payout.controllers');
const express = require('express');
const verifyRoles = require('../utils/verifyRoles');
const { verifyJWT } = require('../utils/verifyJWT');

const payoutRouter = express.Router();

payoutRouter.route('/')
    .post(verifyJWT, verifyRoles('doctor'), requestPayout);



module.exports = payoutRouter;