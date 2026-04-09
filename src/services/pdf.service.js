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

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { margin: 20mm; }
          body { font-family: 'Liberation Sans', 'DejaVu Sans', Arial, sans-serif; color: #334155; line-height: 1.5; margin: 0; }
          .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
          .hospital-name { font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -1px; }
          .report-title { text-align: right; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 12px; }
          .info-item { font-size: 13px; }
          .label { color: #94a3b8; font-weight: bold; text-transform: uppercase; font-size: 10px; display: block; }
          .value { color: #1e293b; font-weight: bold; font-size: 14px; }

          .record-card { border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 25px; page-break-inside: avoid; }
          .record-header { display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 15px; }
          .record-date { font-weight: 800; color: #0f172a; font-size: 14px; }
          
          .question-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #f1f5f9; font-size: 12px; }
          .ans-value { font-weight: bold; color: #0f172a; }
          .ans-boolean { padding: 2px 8px; border-radius: 4px; font-size: 10px; text-transform: uppercase; }
          .bg-yes { background: #dcfce7; color: #166534; }
          .bg-no { background: #fee2e2; color: #991b1b; }

          .alert-box { margin-top: 15px; background: #fff1f2; border-left: 4px solid #f43f5e; padding: 15px; border-radius: 8px; }
          .doctor-box { margin-top: 10px; background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 8px; font-size: 12px; }
          .doctor-label { font-weight: bold; color: #0369a1; margin-bottom: 5px; display: block; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td class="hospital-name">MedAlerta v2.0</td>
            <td class="report-title">Historia Clínica Digital<br/>Expedido: ${new Date().toLocaleDateString()}</td>
          </tr>
        </table>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Paciente</span>
            <span class="value">${patientData.user.firstName} ${patientData.user.lastName}</span>
          </div>
          <div class="info-item">
            <span class="label">Médico Responsable</span>
            <span class="value">Dr. ${patientData.doctor.user.firstName} ${patientData.doctor.user.lastName}</span>
          </div>
        </div>

        ${history.map(record => `
          <div class="record-card">
            <div class="record-header">
              <span class="record-date">Reporte del ${new Date(record.recordDate + 'T00:00:00').toLocaleDateString('es-ES')}</span>
            </div>

            ${record.daily_record_answers.map(ans => {
              const isBoolean = ans.answer === "true" || ans.answer === "false";
              const displayValue = ans.answer === "true" ? "Sí" : ans.answer === "false" ? "No" : ans.answer;
              const colorClass = ans.answer === "true" ? "bg-yes" : ans.answer === "false" ? "bg-no" : "";
              
              return `
                <div class="question-row">
                  <span>${ans.follow_up_question.question}</span>
                  <span class="ans-value ${isBoolean ? 'ans-boolean ' + colorClass : ''}">${displayValue}</span>
                </div>
              `;
            }).join("")}

            ${record.alert ? `
              <div class="alert-box">
                <span class="label" style="color: #991b1b">Resumen de Alerta</span>
                <p style="margin: 5px 0; font-size: 13px; font-weight: bold;">${record.alert.summary}</p>
                
                ${record.alert.doctor_note ? `
                  <div class="doctor-box">
                    <span class="doctor-label">Evaluación Médica:</span>
                    <p style="margin: 2px 0;"><strong>Obs:</strong> ${record.alert.doctor_note.observation}</p>
                    <p style="margin: 2px 0;"><strong>Plan:</strong> ${record.alert.doctor_note.actionPlan}</p>
                  </div>
                ` : `<p style="font-size: 11px; color: #ef4444 italic">Pendiente de revisión por el doctor.</p>`}
              </div>
            ` : ""}
          </div>
        `).join("")}
      </body>
    </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle('document.fonts.ready');

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    return pdf;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  } finally {
    if (browser) await browser.close(); // 🔥 IMPORTANTE: Cierra siempre el proceso
  }
};

module.exports = { generatePatientHistoryPDF };