const puppeteer = require("puppeteer");

const generatePatientHistoryPDF = async (patientData, history) => {
  let browser;
  try {
    const isProd = process.env.NODE_ENV === "production";
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: isProd ? "/usr/bin/google-chrome" : undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const birthDate = patientData.birthDate ? new Date(patientData.birthDate) : null;
    const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : 'N/A';
    const phone = patientData.user?.phone || 'No registrado';
    const address = patientData.address || 'No registrada';
    const gender = patientData.gender || 'No especificado';

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { margin: 15mm; }
          body { font-family: 'Helvetica', Arial, sans-serif; color: #1e293b; line-height: 1.4; margin: 0; }
          .header { border-bottom: 3px solid #0284c7; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .hospital-name { font-size: 24px; font-weight: bold; color: #0284c7; }
          .medical-banner { margin-bottom: 25px; display: flex; flex-direction: column; gap: 8px; }
          .banner-item { background: #fbbf24; padding: 8px 20px; border-radius: 50px; font-size: 12px; font-weight: bold; color: #000; border: 1px solid #d97706; display: inline-block; }
          .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e2e8f0; }
          .info-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
          .info-value { font-size: 13px; font-weight: bold; color: #0f172a; display: block; }
          .record-card { border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 25px; page-break-inside: avoid; overflow: hidden; }
          .record-header { background: #f1f5f9; padding: 10px 15px; font-weight: bold; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
          .content-section { padding: 15px; }
          .section-title { font-size: 11px; font-weight: bold; color: #0284c7; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #e0f2fe; margin-top: 10px; }
          .vitals-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 10px; }
          .vital-box { background: #f0f9ff; padding: 6px; border-radius: 6px; text-align: center; border: 1px solid #bae6fd; }
          .vital-name { font-size: 8px; color: #0369a1; font-weight: bold; display: block; }
          .vital-val { font-size: 11px; font-weight: bold; }
          .treatment-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 5px; }
          .treatment-table th { text-align: left; background: #f8fafc; padding: 8px; border: 1px solid #e2e8f0; }
          .treatment-table td { padding: 8px; border: 1px solid #e2e8f0; }
          .note-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 10px; margin-top: 5px; font-size: 11px; }
          .exam-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; margin-bottom: 10px; }
          .exam-item { border-bottom: 1px dashed #e2e8f0; padding: 2px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">MEDALERTA V2.0</div>
          <div style="text-align: right; font-size: 10px; color: #64748b;">
            HISTORIA CLÍNICA DIGITAL<br/>
            Impreso el: ${new Date().toLocaleString('es-ES')}
          </div>
        </div>

        <div class="patient-info">
          <div><span class="info-label">Paciente</span><span class="info-value">${patientData.user.firstName} ${patientData.user.lastName}</span></div>
          <div><span class="info-label">Médico a cargo</span><span class="info-value">Dr. ${patientData.doctor.user.firstName} ${patientData.doctor.user.lastName}</span></div>
        </div>

        <div class="medical-banner">
          <div class="banner-item">🆔 ID Paciente: ${patientData.id}</div>
          <div class="banner-item">📅 Edad y Sexo: ${age} años - ${gender}</div>
          <div class="banner-item">📍 Dirección: ${address}</div>
          <div class="banner-item">📞 Nº de celular: ${phone}</div>
        </div>

        ${history.map(record => {
          const isAlert = record.type === 'ALERTA';
          const headerColor = isAlert ? '#ef4444' : '#0284c7';
          const title = isAlert ? 'ALERTA DE SEGUIMIENTO' : 'CONSULTA MÉDICA PRESENCIAL';
          // Formateamos la fecha del registro con hora
          const recordFullDate = new Date(record.createdAt).toLocaleString('es-ES');

          return `
          <div class="record-card" style="border-top: 4px solid ${headerColor}">
            <div class="record-header">
              <span style="color: ${headerColor}">${title}</span>
              <span>${recordFullDate}</span>
            </div>

            <div class="content-section">
              ${!isAlert && record.vital_signs && Object.keys(record.vital_signs).length > 0 ? `
                <div class="section-title">Signos Vitales</div>
                <div class="vitals-grid">
                  ${Object.entries(record.vital_signs).map(([key, val]) => `
                    <div class="vital-box">
                      <span class="vital-name">${key.toUpperCase()}</span>
                      <span class="vital-val">${val}</span>
                    </div>
                  `).join("")}
                </div>
              ` : ''}

              ${!isAlert && record.physical_exam && Object.keys(record.physical_exam).length > 0 ? `
                <div class="section-title">Examen Físico por Sistemas</div>
                <div class="exam-grid">
                  ${Object.entries(record.physical_exam).map(([sistema, hallazgo]) => `
                    <div class="exam-item"><strong>${sistema.toUpperCase()}:</strong> ${hallazgo}</div>
                  `).join("")}
                </div>
              ` : ''}

              ${isAlert && record.daily_record_answers && record.daily_record_answers.length > 0 ? `
                <div class="section-title">Síntomas Reportados (Triaje)</div>
                <div class="note-box">
                  ${record.daily_record_answers.map(ans => `
                    <p style="margin: 5px 0;"><strong>${ans.follow_up_question?.question || 'Pregunta'}:</strong> ${ans.answer}</p>
                  `).join("")}
                </div>
              ` : ''}

              <div class="section-title">Evaluación del Médico</div>
              <div style="font-size: 11px; margin-bottom: 10px;">
                <p style="margin: 4px 0;"><strong>Relato/Obs:</strong> ${record.reason_for_consultation || 'Sin registros'}</p>
                <p style="margin: 4px 0;"><strong>Diagnóstico:</strong> ${record.diagnosis && record.diagnosis.length > 0 ? record.diagnosis.join(", ") : 'Pendiente'}</p>
              </div>

              ${record.treatment && (Array.isArray(record.treatment) ? record.treatment.length > 0 : Object.keys(record.treatment).length > 0) ? `
                <div class="section-title">Plan de Acción / Tratamiento</div>
                <table class="treatment-table">
                  <thead>
                    <tr><th>Medicamento/Indicación</th><th>Dosis</th><th>Duración</th></tr>
                  </thead>
                  <tbody>
                    ${Array.isArray(record.treatment) 
                      ? record.treatment.map(t => `<tr><td>${t.medicina}</td><td>${t.dosis}</td><td>${t.duracion}</td></tr>`).join("")
                      : `<tr><td>Seguimiento</td><td>${record.treatment.indicaciones_alerta || 'N/A'}</td><td>${record.treatment.seguimiento_sugerido || 'N/A'}</td></tr>`
                    }
                  </tbody>
                </table>
              ` : ''}
            </div>
          </div>`;
        }).join("")}
      </body>
    </html>`;

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle('document.fonts.ready');
    
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' }
    });

    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { generatePatientHistoryPDF };