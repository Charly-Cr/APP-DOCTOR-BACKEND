const catchError = require('../utils/catchError');
const { getAllUser, createUser, getOneUser, putUser, removeUser, changePassword, getUserByIdSafe } = require('../services/user.services');
const jwt = require('jsonwebtoken');

const getAll = catchError(async (req, res) => {
  const results = await getAllUser();
  return res.json(results);
});


const create = catchError(async (req, res) => {

  const {firstName, lastName, email, phone, role, acceptedTerms } = req.body;

  // 🛡️ Filtro de seguridad:
  // Si el rol enviado no es 'patient' ni 'doctor', lo forzamos a ser 'patient'
  // Esto evita que alguien se inyecte como 'superadmin'
  const allowedRoles = ['patient', 'doctor'];
  const finalRole = allowedRoles.includes(role) ? role : 'patient';

  const result = await createUser({
    firstName,
    lastName,
    email,
    phone,
    passwordHash: req.passwordHash,
    role: finalRole,
    acceptedTerms
  });

  return res.status(201).json(result);
});


const getOne = catchError(async (req, res) => {
  const { userId } = req.params; // ID del objetivo (URL)
  const loggedUser = req.user;   // Datos del que opera (Token)

  // Seguridad: Solo el dueño o el superadmin pueden ver el detalle
  if (loggedUser.role !== 'superadmin' && loggedUser.id !== parseInt(userId)) {
    return res.status(403).json({ message: "No tienes permiso para ver este perfil" });
  }

  const result = await getOneUser(userId);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const update = catchError(async (req, res) => {
  const { userId } = req.params;
  const loggedUser = req.user;

  // Seguridad: Solo el dueño o el superadmin pueden editar
  if (loggedUser.role !== 'superadmin' && loggedUser.id !== parseInt(userId)) {
    return res.status(403).json({ message: "No tienes permiso para actualizar este usuario" });
  }

  // Usamos el servicio que ya tienes (putUser)
  const result = await putUser(req.body, userId);
  
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]); // Retorna el usuario actualizado
});

const remove = catchError(async (req, res) => {
  // 1. Extraemos el ID del usuario a eliminar de los parámetros
  const { userId } = req.params;
  // 2. Obtenemos los datos del usuario que está logueado (inyectados por verifyJWT)
  const loggedUser = req.user;
  /**
   * REGLA DE SEGURIDAD:
   * Solo el 'superadmin' puede borrar a cualquiera.
   * Si no es admin, solo puede borrarse a sí mismo.
   */
  if (loggedUser.role !== 'superadmin' && loggedUser.id !== parseInt(userId)) {
    return res.status(403).json({ 
      message: "No tienes permisos suficientes para eliminar este perfil" 
    });
  }
  // 3. Ejecutamos la eliminación centralizada (Limpia DB + Cloudinary)
  const result = await removeUser(userId);
  // 4. Si el servicio devuelve 0 o null, es que el usuario no existía
  if (!result) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  // 5. 204 No Content: Todo salió bien y no hay nada más que decir
  return res.sendStatus(204);
});


const login = catchError(async (req, res) => {
  const user = req.userlogged;
  
  if (!user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  // Eliminar el campo password del objeto antes de devolverlo
  const { password, ...userWithoutPassword } = user.toJSON();
  

  return res.json({ user: userWithoutPassword, message: "Login exitoso" }); 
  
});


const logged = catchError(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No autorizado" });
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  // 🔥 ahora limpio y correcto
  const foundUser = await getUserByIdSafe(decoded.id);

  if (!foundUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  return res.json({ user: foundUser });
});



const logout = catchError(async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Sesión cerrada correctamente" });
});


const changeMyPassword = catchError(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  const result = await changePassword(userId, currentPassword, newPassword);

  if (result === null) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (result === "INVALID_PASSWORD") {
    return res.status(401).json({ message: "Contraseña actual incorrecta" });
  }

  return res.json({ message: "Contraseña actualizada correctamente" });
});

module.exports = {
  getAll,
  create, 
  getOne,
  remove,
  update,
  login, 
  logged,
  logout,
  changeMyPassword
}