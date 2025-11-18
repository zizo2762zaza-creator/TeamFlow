//------------------------------------------------------
// TeamFlow Frontend API (Final GAS Edition)
//------------------------------------------------------
// src/services/api.ts
// يتصل بالـ proxy على نفس النطاق: /api/gas-proxy
const BASE = "/api/gas-proxy";

async function callApi(payload: any, opts: RequestInit = {}) {
  try {
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
      body: JSON.stringify(payload),
      ...opts,
    });

    // محاولة قراءة JSON، لكن قد يكون النص HTML في حالات الخطأ
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      // رجع كخطأ قابل للعرض
      return { ok: false, error: "invalid_response", raw: text, status: res.status };
    }
  } catch (err: any) {
    console.error("callApi error", err);
    return { ok: false, error: "network_error", details: err.message || String(err) };
  }
}

/* --- واجهات API المستخدمة في الواجهة --- */

export async function login(email?: string) {
  // إذا قدمت البريد فهذا login عبر الرمز اليدوي (manual) — GAS تتوقع action: "login" مع payload.email
  const payload: any = { action: "login", payload: {} };
  if (email) payload.payload.email = email;
  return callApi(payload);
}

export async function loginManual(email: string) {
  return callApi({ action: "loginManual", payload: { email } });
}

export async function getAllUsers() {
  return callApi({ action: "getAllUsers" });
}

export async function getUpcomingMatch() {
  return callApi({ action: "getUpcomingMatch" });
}

export async function getAttendanceByMatch(matchId: string) {
  return callApi({ action: "getAttendanceByMatch", matchId });
}

export async function setAttendance(payload: any) {
  return callApi({ action: "setAttendance", payload });
}

export async function addSuggestion(payload: any) {
  return callApi({ action: "addSuggestion", payload });
}

export async function voteSuggestion(payload: any) {
  return callApi({ action: "voteSuggestion", payload });
}

export async function generateTeams(payload: any) {
  return callApi({ action: "generateTeams", payload });
}

export default {
  login,
  loginManual,
  getAllUsers,
  getUpcomingMatch,
  getAttendanceByMatch,
  setAttendance,
  addSuggestion,
  voteSuggestion,
  generateTeams,
};
