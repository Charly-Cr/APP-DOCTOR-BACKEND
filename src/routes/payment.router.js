const express = require('express');
const { create, approve, uploadVoucher } = require('../controllers/payment.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');
const upload = require('../utils/multer');

const paymentRouter = express.Router();


// El doctor crea su intención de pago (Claim)
paymentRouter.route('/checkout')
    .post(verifyJWT, create);

// El webhook o el admin aprueban el pago
// OJO: En producción, el webhook de Yape debería tener su propia seguridad o API Key
paymentRouter.route('/:id/approve')
    .post(verifyJWT, verifyRoles('superadmin'), approve); 


paymentRouter.route('/:id/voucher')
    .patch(verifyJWT, upload.single('image'), uploadVoucher);


module.exports = paymentRouter;