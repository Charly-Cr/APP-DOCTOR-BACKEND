const { getAll, create, getOne, remove, update, login, logged, logout } = require('../controllers/user.controllers');
const express = require('express');
const { verifyJWT } = require('../utils/verifyJWT');
const loginMiddlewares = require('../middlewares/login.middlewares');
const sessionJWT = require('../middlewares/sessionJWT.middlewares');
const fieldsDeleteUpdate = require('../middlewares/fieldsDeleteUpdate.middlewares');
const { passwordMiddlewares } = require('../middlewares/password.middlewares');
const verifyRoles = require('../utils/verifyRoles');


const userRouter = express.Router();

userRouter.route('/')
// Solo el SUPERADMIN puede ver todos los usuarios registrados en la plataforma
  .get(verifyJWT, verifyRoles("superadmin"),  getAll)
  .post(passwordMiddlewares, create);


userRouter.route('/login')
  .post(loginMiddlewares, sessionJWT, login)

userRouter.route('/me')
  .get(verifyJWT, logged) // Verifica si el usuario está autenticado

userRouter.route('/logout')
  .post(verifyJWT, logout) // Cierra sesión eliminando la cookie
  

userRouter.route('/:userId')
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, fieldsDeleteUpdate, update);

module.exports = userRouter;

