const express = require('express');
const userRouter = require('./user.router');
const doctorRouter = require('./doctor.router');
const patientRouter = require('./patient.router');
const followUpTemplateRouter = require('./followUpTemplate.router');
const dailyRecordRouter = require('./dailyRecord.router');
const doctorHistoryRouter = require('./doctorHistory.router');
const alertRouter = require('./alert.router');
const doctorNoteRouter = require('./doctorNote.router');
const patientNoteRouter = require('./patientNote.router');
const subscriptionRouter = require('./subscription.router');
const paymentRouter = require('./payment.router');
const doctorDashboardRouter = require('./doctorDashboard.router');
const router = express.Router();

// colocar las rutas aquí
router.use('/users', userRouter)
router.use('/doctors', doctorRouter)
router.use('/patients', patientRouter)
router.use('/follow-up-templates', followUpTemplateRouter);
router.use('/daily-records', dailyRecordRouter)
router.use('/doctor', doctorHistoryRouter);
router.use('/alerts', alertRouter);
router.use('/', doctorNoteRouter)
router.use('/', patientNoteRouter);
router.use('/subscriptions', subscriptionRouter)
router.use('/payments', paymentRouter)
router.use('/doctor', doctorDashboardRouter);





module.exports = router;
