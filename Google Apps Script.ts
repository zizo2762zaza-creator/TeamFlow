/*******************************************************
 * TeamFlow Backend – Complete API (Workspace)
 * Version: Final Build – 2025-11-16
 *******************************************************/

const PROP_SHEET_ID = "SHEET_ID"; // ضع قيمة SHEET_ID داخل Script Properties

/* ---------------------------------------------------
   Helpers
--------------------------------------------------- */

function getProp(k) {
  return PropertiesService.getScriptProperties().getProperty(k);
}

function getSheet() {
  const id = getProp(PROP_SHEET_ID);
  if (!id) throw new Error("SHEET_ID not configured in Script Properties");
  return SpreadsheetApp.openById(id);
}

function sheetToObjects(name) {
  const sh = getSheet().getSheetByName(name);
  if (!sh) return [];
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => String(h).trim());
  return rows.slice(1).map(r => {
    const o = {};
    headers.forEach((h, i) => { o[h] = r[i]; });
    return o;
  });
}

function appendRecord(sheetName, obj) {
  const ss = getSheet();
  let sh = ss.getSheetByName(sheetName);
  if (!sh) {
    sh = ss.insertSheet(sheetName);
    sh.appendRow(Object.keys(obj));
  }
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const row = headers.map(h => obj[h] !== undefined ? obj[h] : "");
  sh.appendRow(row);
}

function writeLog(level, message, meta) {
  try {
    appendRecord("logs", {
      ts: new Date().toISOString(),
      level,
      message,
      meta: JSON.stringify(meta || {})
    });
  } catch (e) {
    console.error("Log failed:", e);
  }
}

function json(obj) { // تم تعديل الوظيفة لترجع الكائن مباشرة
  return obj;
}

/* ---------------------------------------------------
   Routing
--------------------------------------------------- */

function doGet(e) {
  return buildResponse(handleRequest(e));
}

function doPost(e) {
  return buildResponse(handleRequest(e));
}

function doOptions(e) {
  return buildResponse({});
}

function buildResponse(data) {
  const response = HtmlService.createHtmlOutput(JSON.stringify(data));
  
  response.setMimeType(ContentService.MimeType.JSON);

  response.append("<meta http-equiv='Access-Control-Allow-Origin' content='*'>");
  response.append("<meta http-equiv='Access-Control-Allow-Methods' content='GET, POST, OPTIONS'>");
  response.append("<meta http-equiv='Access-Control-Allow-Headers' content='Content-Type'>");

  return response;
}

function handleRequest(e) {
  try {
    let params = e.parameter || {};
    let body = {};

    if (e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (_) {}
    }

    const action = params.action || body.action;
    const payload = body.payload || {};

    writeLog("info", "Request", { action, user: Session.getActiveUser().getEmail() });

    if (!action) return json({ ok: false, error: "Missing action" });

    switch (action) {
      case "test": return json({ ok: true, ts: new Date().toISOString() });
      case "login": return json(login(payload));
      case "getAllUsers": return json(getAllUsers());
      case "getUpcomingMatch": return json(getUpcomingMatch());
      case "getAttendanceByMatch": return json(getAttendanceByMatch(params.matchId));
      case "setAttendance": return json(setAttendance(payload));
      case "getSuggestions": return json(getSuggestions());
      case "addSuggestion": return json(addSuggestion(payload));
      case "voteSuggestion": return json(voteSuggestion(payload));
      case "generateTeams": return json(generateTeams(payload));
      default:
        return json({ ok: false, error: "Unknown action: " + action });
    }

  } catch (err) {
    writeLog("error", "Exception", { error: err.message, stack: err.stack });
    return json({ ok: false, error: err.message });
  }
}

/* ---------------------------------------------------
   Implementations
--------------------------------------------------- */

function login(payload) {
  const email = payload.email || Session.getActiveUser().getEmail();
  
  if (!email) return { ok: false, error: "missing_email" };

  const users = getAllUsers();
  const user = users.find(u => String(u.email).toLowerCase() === email.toLowerCase());

  if (!user) {
    return { ok: false, error: "user_not_found", email };
  }

  return { ok: true, user };
}

function getAllUsers() {
  return sheetToObjects("Users").map(r => ({
    id: String(r.id),
    email: String(r.email),
    name: r.name,
    role: r.role,
    skillLevel: Number(r.skillLevel || 3)
  }));
}

function getUpcomingMatch() {
  const matches = sheetToObjects("matches");

  let nextMatch = null;
  matches.forEach(m => {
    if (m.status === "UPCOMING") nextMatch = m;
  });

  if (!nextMatch) return { ok: false, error: "no_upcoming_match" };
  return { ok: true, match: nextMatch };
}

function getAttendanceByMatch(matchId) {
  const items = sheetToObjects("attendance")
    .filter(a => a.matchId === matchId);

  return { ok: true, items };
}

function setAttendance({ matchId, userId, userName, status }) {
  appendRecord("attendance", {
    matchId,
    userId,
    userName,
    status,
    confirmedAt: new Date().toISOString()
  });

  return { ok: true };
}

function getSuggestions() {
  return { ok: true, items: sheetToObjects("suggestions") };
}

function addSuggestion(payload) {
  const id = "sug_" + Date.now();

  appendRecord("suggestions", {
    id,
    matchDateISO: payload.matchDateISO,
    location: payload.location || "",
    notes: payload.notes || "",
    proposerId: payload.proposerId,
    votesCount: 0,
    voters: "",
    createdAt: new Date().toISOString()
  });

  return { ok: true, id };
}

function voteSuggestion({ id, voterId }) {
  const rows = sheetToObjects("suggestions");
  const sh = getSheet().getSheetByName("suggestions");

  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

  const idCol = headers.indexOf("id") + 1;
  const votersCol = headers.indexOf("voters") + 1;
  const votesCountCol = headers.indexOf("votesCount") + 1;

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].id === id) {
      const rowIndex = i + 2;
      let voters = String(sh.getRange(rowIndex, votersCol).getValue() || "");
      let count = Number(sh.getRange(rowIndex, votesCountCol).getValue() || 0);

      if (!voters.split(",").includes(voterId)) {
        voters = voters ? voters + "," + voterId : voterId;
        count++;
      }

      sh.getRange(rowIndex, votersCol).setValue(voters);
      sh.getRange(rowIndex, votesCountCol).setValue(count);

      return { ok: true, id, votes: count };
    }
  }
  return { ok: false, error: "not_found" };
}

function generateTeams({ matchId }) {
  const attendance = sheetToObjects("attendance")
    .filter(a => a.matchId === matchId && a.status === "ATTENDING");

  const teams = {
    teamA: [],
    teamB: []
  };

  attendance.forEach((p, i) => {
    if (i % 2 === 0) teams.teamA.push(p.userName);
    else teams.teamB.push(p.userName);
  });

  appendRecord("team_divisions", {
    matchId,
    generatedAt: new Date().toISOString(),
    teams: JSON.stringify(teams)
  });

  return { ok: true, teams };
}
