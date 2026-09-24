/* =====================================================================
   CHMD · Instrumento de Valoración Final — backend en Google Sheets
   Mismo esquema que la invitación del Bar Mitzvá (Apps Script + Sheets),
   con una diferencia: LEER los resultados exige contraseña.

   Instalación: ver committee-scoring/README.md (paso 1).
   ===================================================================== */

// Escribe tu contraseña aquí, en el editor de Apps Script (NO en GitHub:
// el repositorio es público). Mientras diga CAMBIA-ESTA-CONTRASEÑA,
// nadie puede ver los resultados.
const ADMIN_PASSWORD = "CAMBIA-ESTA-CONTRASEÑA";

const SHEET_NAME = "Valoraciones";
const HEADERS = ["id", "fecha", "evaluador", "preferencia_final", "razon_principal", "datos_json"];
const CANDIDATAS = ["Daniela", "Lila"];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0){
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function passwordOk_(p) {
  return ADMIN_PASSWORD !== ("CAMBIA-" + "ESTA-CONTRASEÑA") && typeof p === "string" && p === ADMIN_PASSWORD;
}

function filas_(sh) {
  const n = sh.getLastRow();
  return n > 1 ? sh.getRange(2, 1, n - 1, HEADERS.length).getValues() : [];
}

const clave_ = nombre => String(nombre || "").trim().toLowerCase();

function enviar_(row) {
  const nombre = String((row && row.evaluator_name) || "").trim();
  if (nombre.length < 2 || nombre.length > 80) return { ok: false, error: "INVALID" };
  if (CANDIDATAS.indexOf(row.final_choice) === -1) return { ok: false, error: "INVALID" };
  if (!row.scores || typeof row.scores !== "object" || !row.comparisons || typeof row.comparisons !== "object") return { ok: false, error: "INVALID" };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = hoja_();
    if (filas_(sh).some(f => clave_(f[2]) === clave_(nombre))) return { ok: false, error: "DUPLICATE" };
    const reg = {
      id: Utilities.getUuid(),
      created_at: new Date().toISOString(),
      evaluator_name: nombre,
      scores: row.scores,
      comparisons: row.comparisons,
      final_choice: row.final_choice,
      final_reasoning: Array.isArray(row.final_reasoning) ? row.final_reasoning.slice(0, 3).map(String) : [],
    };
    sh.appendRow([reg.id, reg.created_at, reg.evaluator_name, reg.final_choice, reg.final_reasoning.join(" | "), JSON.stringify(reg)]);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function resultados_(password) {
  if (!passwordOk_(password)) return { ok: false, error: "BAD_PASSWORD" };
  const rows = [];
  filas_(hoja_()).forEach(f => { try { rows.push(JSON.parse(f[5])); } catch (e) { /* fila dañada: se omite */ } });
  return { ok: true, rows: rows };
}

function eliminar_(password, id) {
  if (!passwordOk_(password)) return { ok: false, error: "BAD_PASSWORD" };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = hoja_();
    const f = filas_(sh);
    for (let i = f.length - 1; i >= 0; i--) if (f[i][0] === id) sh.deleteRow(i + 2);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// Todas las llamadas llegan por POST (así la contraseña no viaja en la dirección).
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return respuesta_({ ok: false, error: "INVALID" }); }
  switch (body && body.action) {
    case "submit":  return respuesta_(enviar_(body.row));
    case "results": return respuesta_(resultados_(body.password));
    case "delete":  return respuesta_(eliminar_(body.password, body.id));
    default:        return respuesta_({ ok: false, error: "INVALID" });
  }
}

// Abrir la dirección del servicio en el navegador solo confirma que está activo; no muestra datos.
function doGet() {
  return respuesta_({ ok: true, servicio: "CHMD · Valoración Final" });
}
