const catchError = require('../utils/catchError');
const { getDoctorDashboard } = require('../services/doctorDashboard.services');

const getDashboard = catchError(async (req, res) => {
    const doctorUserId = req.user.id;
    const result = await getDoctorDashboard(doctorUserId);
    
    if (!result) return res.status(404).json({ message: "Doctor no encontrado" });
    
    res.json(result);
});

module.exports = { getDashboard };