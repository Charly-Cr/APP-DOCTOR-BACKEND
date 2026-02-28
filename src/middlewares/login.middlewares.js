const bcrypt = require("bcrypt")
const { loginEmailUser } = require("../services/user.services")

const loginMiddlewares = async (req, res, next) => {
  const { email, password } = req.body

  const user = await loginEmailUser(email)
  if (!user) return res.status(401).json({ message: "credentials invalid" })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(401).json({ message: "credentials invalid" })

    req.userlogged = user
  next()

}

module.exports = loginMiddlewares






  
