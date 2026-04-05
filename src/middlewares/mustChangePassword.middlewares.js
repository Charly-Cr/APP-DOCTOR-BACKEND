const mustChangePassword = (req, res, next) => {
  const user = req.user;

  if (user.mustChangePassword) {
    return res.status(403).json({
      message: "Debes cambiar tu contraseña antes de continuar"
    });
  }

  next();
};

module.exports = {
    mustChangePassword
}