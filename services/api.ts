// src/services/api.ts
export const API_BASE = "/api/gas";

// wrapper
async function callApi<T>(action: string, payload?: Record<string, any>): Promise<T> {
  try {
    if (payload) {
      const res = await fetch(`${API_BASE}?action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      return await res.json();
    } else {
      const res = await fetch(`${API_BASE}?action=${action}`);
      return await res.json();
    }
  } catch (err) {
    console.error("API error:", err);
    throw new Error(`Network error: ${String(err)}`);
  }
}

export const api = {
  login: (email: string) => callApi("login", { email }),
  getAllUsers: () => callApi("getAllUsers"),
  getSuggestions: () => callApi("getSuggestions"),
  addSuggestion: (proposerId: string, date: string, location: string, notes: string) =>
    callApi("addSuggestion", { proposerId, date, location, notes }),
  voteForSuggestion: (suggestionId: string, userId: string) => callApi("voteSuggestion", { id: suggestionId, voterId: userId }),
  getUpcomingMatch: () => callApi("getUpcomingMatch"),
  getAttendanceByMatch: (matchId: string) => callApi("getAttendanceByMatch", { matchId }),
  setAttendance: (matchId: string, userId: string, userName: string, status: string) =>
    callApi("setAttendance", { matchId, userId, userName, status }),
  generateTeams: (matchId: string) => callApi("generateTeams", { matchId }),
};
