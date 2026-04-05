const { z } = require('zod');

const createUserSchema = z.object({
  firstName: z.string()
    .min(2, "El nombre es muy corto")
    .max(50, "El nombre es muy largo")
    .trim(),
  lastName: z.string()
    .min(2, "El apellido es muy corto")
    .max(50, "El apellido es muy largo")
    .trim(),
  email: z.string()
    .email("Formato de email inválido")
    .toLowerCase()
    .trim(),
  phone: z.string()
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números")
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .max(11, "El teléfono no debe pasar de 11 dígitos"),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["patient", "doctor"]).default("patient"),
  acceptedTerms: z.boolean().refine((val) => val === true, {
  message: "Debes aceptar los términos y condiciones",
}),
});

const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const updateUserSchema = createUserSchema.partial();

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});

// ESTO ES LO QUE DEBES USAR SI TRABAJAS CON REQUIRE
module.exports = { 
  createUserSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema
};