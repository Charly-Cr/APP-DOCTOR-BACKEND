const catchError = require('../utils/catchError');
const { getPatientHistory, getPatientFullData } = require('../services/doctorHistory.services');
const { generatePatientHistoryPDF } = require('../services/pdf.service');

const getHistory = catchError(async (req, res) => {
  const doctorUserId = req.user.id;
  const { patientId } = req.params;

  const result = await getPatientHistory(doctorUserId, patientId);

  if (result === 'FORBIDDEN') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  if (!result) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  res.json(result);
});



const getHistoryPDF = catchError(async (req, res) => {
  const doctorUserId = req.user.id;
  const { patientId } = req.params;

  // 🔐 historial (seguridad)
  const history = await getPatientHistory(doctorUserId, patientId);

  if (history === 'FORBIDDEN') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  if (!history) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // ✅ USAS EL SERVICE (no modelos directos)
  const patientData = await getPatientFullData(patientId);

  // 🧾 PDF
  const pdf = await generatePatientHistoryPDF(patientData, history);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=historia.pdf');
  res.setHeader('Content-Length', pdf.length); // 🔥 Ayuda al navegador a saber cuánto esperar

  return res.end(pdf); // Usa .end() o .send() para enviar el buffer directamente
  
});



module.exports = {
  getHistory,
  getHistoryPDF
};
