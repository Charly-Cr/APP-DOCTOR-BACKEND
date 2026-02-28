const express = require('express');
const { create } = require('../controllers/doctorNote.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');

const doctorNoteRouter = express.Router();

doctorNoteRouter.route('/alerts/:alertId/notes')
  .post(verifyJWT, verifyRoles('doctor'), create );

module.exports = doctorNoteRouter;
