// const { business } = require("../models"); // Asegúrate de que esta ruta sea correcta para tu modelo business

// // Middleware para validar que el usuario autenticado tiene acceso al businessId solicitado
// const validateBusinessAccess = async (req, res, next) => {
//   // Asumimos que verifyJWT y verifyRoles ya se ejecutaron antes,
//   // y que req.user ya contiene la información del usuario autenticado (id y role).
//   // Si tu middleware JWT adjunta el usuario a 'req.user' (no 'req.userlogged'),
//   // entonces usa req.user aquí. (Lo ajusté a 'req.user' para que coincida con tu verifyRoles).

//   if (!req.user || !req.user.id || !req.user.role) {
//     // Esto no debería pasar si verifyJWT y verifyRoles ya se ejecutaron correctamente,
//     // pero es una buena salvaguarda.
//     return res.status(401).json({ error: "No autorizado. Usuario no definido." });
//   }

//   const userId = req.user.id;
//   const userRole = req.user.role;
//   const requestedBusinessId = req.body.businessId || req.params.businessId; // El businessId puede venir del body o de los parámetros de la URL

//   if (!requestedBusinessId) {
//     return res.status(400).json({ error: "ID de negocio no proporcionado." });
//   }

//   try {
//     // Si el rol es 'superadmin', tiene acceso a cualquier negocio.
//     if (userRole === "superadmin") {
//       const businessData = await business.findByPk(requestedBusinessId);
//       if (!businessData) {
//         return res.status(404).json({ error: "Negocio no encontrado." });
//       }
//       req.businessData = businessData; // Adjuntamos el negocio al request para que el controlador lo use
//       return next(); // Superadmin tiene acceso
//     }

//     // Para roles que no son 'superadmin' (ej. 'admin', 'employed'),
//     // solo pueden acceder a los negocios que tienen asignados.
//     const associatedBusiness = await business.findOne({
//       where: {
//         id: requestedBusinessId,
//         userId: userId, // CRUCIAL: Solo busca negocios asociados a este userId
//       },
//     });

//     if (!associatedBusiness) {
//       // Si no encuentra el negocio asociado al usuario
//       return res.status(403).json({ error: "Acceso denegado a este negocio. No tienes permisos." });
//     }

//     req.businessData = associatedBusiness; // Adjuntamos el negocio al request
//     next(); // Acceso permitido

//   } catch (error) {
//     console.error("Error en middleware multiTenantAuth:", error);
//     res.status(500).json({ error: "Error interno del servidor al verificar acceso." });
//   }
// };

// module.exports = validateBusinessAccess;