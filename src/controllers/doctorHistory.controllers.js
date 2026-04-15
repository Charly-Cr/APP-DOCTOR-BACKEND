const catchError = require('../utils/catchError');
const { getPatientHistory, getPatientFullData, getMyOwnHistory, getSingleRecord } = require('../services/doctorHistory.services');
const { generatePatientHistoryPDF } = require('../services/pdf.service');
const { addToQueue } = require('../utils/pdfQueue');

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


const getMyHistory = catchError(async (req, res) => {
  const userId = req.user.id; // ID del paciente desde el JWT

  const result = await getMyOwnHistory(userId);

  if (!result) {
    return res.status(404).json({ message: 'Perfil de paciente no encontrado' });
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

  
  // 🔥 AQUÍ entra la cola del PDF
  const pdf = await addToQueue(() =>
    generatePatientHistoryPDF(patientData, history)
  );

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=historia.pdf');
  res.setHeader('Content-Length', pdf.length); // 🔥 Ayuda al navegador a saber cuánto esperar

  return res.end(pdf); // Usa .end() o .send() para enviar el buffer directamente
  
});


const getSingleRecordPDF = catchError(async (req, res) => {
  const { recordId } = req.params; // ID de la consulta que clickeaste

  // 1. Buscamos solo ese registro específico
  const record = await getSingleRecord(recordId);

  if (!record) {
    return res.status(404).json({ message: 'Registro no encontrado' });
  }

  // 2. Traemos los datos del paciente usando el patientId que viene en el record
  const patientData = await getPatientFullData(record.patientId);

  // 3. Importante: generatePatientHistoryPDF espera un Array (history.map)
  // Así que metemos el único registro dentro de un array [record]
  const pdf = await addToQueue(() =>
    generatePatientHistoryPDF(patientData, [record])
  );

  res.setHeader('Content-Type', 'application/pdf');
  // Le ponemos la fecha al nombre del archivo para que sea ordenado
  res.setHeader('Content-Disposition', `attachment; filename=consulta_${recordId}.pdf`);
  
  return res.end(pdf);
});



module.exports = {
  getHistory,
  getHistoryPDF,        // TRAER TODO EL PDF 
  getSingleRecordPDF,   // TRAER PDF INDIVIDUAL
  getMyHistory
};
