const { getAll, create, getOne, remove, update, login, logged, logout, changeMyPassword } = require('../controllers/user.controllers');
const express = require('express');
const { verifyJWT } = require('../utils/verifyJWT');
const loginMiddlewares = require('../middlewares/login.middlewares');
const sessionJWT = require('../middlewares/sessionJWT.middlewares');
const fieldsDeleteUpdate = require('../middlewares/fieldsDeleteUpdate.middlewares');
const { passwordMiddlewares } = require('../middlewares/password.middlewares');
const verifyRoles = require('../utils/verifyRoles');
const { mustChangePassword } = require('../middlewares/mustChangePassword.middlewares');
const { createUserSchema, changePasswordSchema, updateUserSchema, loginSchema } = require('../schemas/user.schema');
const validate  = require('../middlewares/validate.middleware');


const userRouter = express.Router();

userRouter.route('/')
// Solo el SUPERADMIN puede ver todos los usuarios registrados en la plataforma
  .get(verifyJWT, verifyRoles("superadmin"),  getAll)
  .post(validate( createUserSchema), passwordMiddlewares, create);

  userRouter.route('/change-password')
    .put(verifyJWT, verifyRoles("patient"), mustChangePassword, validate(changePasswordSchema), changeMyPassword)

  userRouter.route('/login')
  .post(validate(loginSchema), loginMiddlewares, sessionJWT, login)


    userRouter.route('/me')
  .get(verifyJWT, logged) // Verifica si el usuario está autenticado

  userRouter.route('/logout')
  .post(verifyJWT, logout) // Cierra sesión eliminando la cookie
  

  userRouter.route('/:userId')
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, fieldsDeleteUpdate, validate(updateUserSchema), update);

  module.exports = userRouter;

