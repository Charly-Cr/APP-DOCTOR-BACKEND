const express = require('express');
const { create, getOne, getAll, update, remove } = require('../controllers/doctor.controllers');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');
const upload = require('../utils/multer');

const doctorRouter = express.Router();

// Rutas base
doctorRouter.route('/')
    .get(verifyJWT, verifyRoles('superadmin'), getAll) // Solo el jefe ve todo
    .post(verifyJWT, verifyRoles('doctor'), upload.single('image'), create); // Solo doctor crea el suyo

// Ruta de auto-consulta
doctorRouter.route('/me')
    .get(verifyJWT, verifyRoles('doctor'), getOne);

// Rutas administrativas (IDOR protected por Role Check)
doctorRouter.route('/:id')
    .put(verifyJWT, verifyRoles('superadmin'), update)
    .delete(verifyJWT, verifyRoles('superadmin'), remove)
    
module.exports = doctorRouter;
