// routes/patientNote.router.js
const express = require('express');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');
const { getMyNotes } = require('../controllers/patientNote.controllers');

const patientNoteRouter = express.Router();

patientNoteRouter.route('/my/notes')
.get(verifyJWT, verifyRoles('patient'), getMyNotes );

module.exports = patientNoteRouter;
