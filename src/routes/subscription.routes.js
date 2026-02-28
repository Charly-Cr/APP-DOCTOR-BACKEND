const { webhookYape } = require('../controllers/subscription.controller');
const express = require('express');
const { verifyJWT } = require('../utils/verifyJWT');
const verifySubscription = require('../utils/verifySubscription');

const subscriptionRouter = express.Router();

subscriptionRouter.route('/webhook/yape')
    .post(webhookYape);

subscriptionRouter.route('/status')
    .get(verifyJWT, verifySubscription, webhookYape);

module.exports = subscriptionRouter;

