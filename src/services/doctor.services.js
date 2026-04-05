const { doctor, user, payment, subscription } = require("../models");
const { uploadToCloudinary } = require("../utils/cloudinary");

const getAllDoctorsService = async (filters = {}) => {
  return await doctor.findAll({
    where: filters,
    include: [
      {
        model: user,
        attributes: ["id", "firstName", "lastName", "email"],
      },
      {
        model: payment,
        as: "payments", //alias
        required: false,
      },
    ],
  });
};

const createDoctorProfile = async (userId, body, file) => {
  // 1. Validaciones de negocio y existencia
  const existing = await doctor.findOne({ where: { userId } });
  if (existing) throw new Error("Ya tienes un perfil creado");

  if (!file) throw new Error("Falta el título médico (imagen)");
  if (!body.specialty) throw new Error("La especialidad es obligatoria");
  if (!body.licenseNumber) throw new Error("El número de colegiatura (CMP) es obligatorio");

  // 2. Cloudinary (Solo subimos si las validaciones de arriba pasaron)
  const uploadResult = await uploadToCloudinary(file, {
    public_id: `doctor_${userId}_${Date.now()}`, // Esto genera un nombre tipo doctor_5_162765...
  });

  // 3. Creación en DB con sellos legales
  return await doctor.create({
    userId,
    specialty: body.specialty,
    licenseNumber: body.licenseNumber,
    degreeImage: uploadResult.secure_url,
    acceptedTerms: true,
    acceptedTermsAt: new Date(),
    contractVersion: "v1.0-2026", // 👈 Versión del contrato
    verified: false,
  });
};

const getMyDoctorProfile = async (userId) => {
  // 1. Guardamos el resultado en una constante (SIN return)
  const profile = await doctor.findOne({
    where: { userId },
    include: {
      model: user,
      attributes: ["firstName", "lastName", "email", "role", "phone"],
    },
  });

  // Si no hay perfil, devolvemos null y listo
  if (!profile) return null;

  // 2. BUSCAMOS LA SUBSCRIPCION ACTIVA
  const sub = await subscription.findOne({
    where: { doctorId: profile.id, status: "active" },
    attributes: ["planType", "endDate", "status"],
  });

  // 3. Convertimos a JSON para poder agregarle el campo nuevo
  const profileData = profile.toJSON();
  const hoy = new Date();

  // Verificamos si expiró según tu modelo
  let currentStatus = sub ? sub.status : "pending";
  const fechaFin = sub ? new Date(sub.endDate) : null;

  if (fechaFin && hoy > fechaFin && currentStatus === "active") {
    // --- [ CAMBIO: Actualizamos el 'status' a 'expired' como tu ENUM ] ---
    await subscription.update(
      { status: "expired" },
      { where: { doctorId: profile.id, status: "active" } },
    );
    currentStatus = "expired";
  }

  // Mapeamos para que el Frontend reciba la verdad
  profileData.planName = sub ? sub.planType : "Sin Plan";
  profileData.subscriptionStatus = currentStatus; // Aquí mandamos 'active' o 'expired'
  profileData.subscriptionEndsAt = sub ? sub.endDate : null;

  return profileData;
};

const updateDoctorService = async (id, body) => {
  return await doctor.update(body, {
    where: { id },
    returning: true,
  });
};

const deleteDoctorService = async (id) => {
  // 1. Busca específicamente por la llave primaria (id)
  const doctorToDelete = await doctor.findByPk(id);

  // Si no lo encuentra, devuelve null y el controlador mandará el 404
  if (!doctorToDelete) return null;

  // 2. Si lo encuentra, lo borra
  return await doctorToDelete.destroy();
};

module.exports = {
  createDoctorProfile,
  getMyDoctorProfile,
  getAllDoctorsService,
  updateDoctorService,
  deleteDoctorService,
};
