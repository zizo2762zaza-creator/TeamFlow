//------------------------------------------------------
// TeamFlow Frontend API (Final GAS Edition)
//------------------------------------------------------

export const BASE_URL =
  "https://script.google.com/macros/s/AKfycbywXNM6aisDcxRHMbKihH-zjU7tad99tT70a7hk4Le5eCpAjWt6DGGzW2Te9uulQ30A3g/exec";

// Generic Caller
async function callApi(body: any) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return await res.json();
  } catch (err) {
    console.error("API error:", err);
    return { ok: false, error: "network_error" };
  }
}

export const api = {
  login: (email: string) => callApi({ action: "login", payload: { email } }),
  getAllUsers: () => callApi({ action: "getAllUsers" }),
  getUpcomingMatch: () => callApi({ action: "getUpcomingMatch" }),
  getAttendanceByMatch: (matchId: string) =>
    callApi({ action: "getAttendanceByMatch", payload: { matchId } }),
  setAttendance: (payload: any) => callApi({ action: "setAttendance", payload }),
  getSuggestions: () => callApi({ action: "getSuggestions" }),
  addSuggestion: (payload: any) =>
    callApi({ action: "addSuggestion", payload }),
  voteSuggestion: (payload: any) =>
    callApi({ action: "voteSuggestion", payload }),
  generateTeams: (payload: any) =>
    callApi({ action: "generateTeams", payload }),
};
