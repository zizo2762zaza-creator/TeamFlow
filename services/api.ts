// src/services/api.ts
export const API_BASE = import.meta.env.VITE_GAS_URL;

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
  login: (userId: string) => callApi("login", { userId }),
  getAllUsers: () => callApi("getAllUsers"),
  getSuggestions: () => callApi("getSuggestions"),
  addSuggestion: (proposerId: string, date: string, location: string, notes: string) =>
    callApi("addSuggestion", { proposerId, date, location, notes }),
  voteForSuggestion: (suggestionId: string, userId: string) => callApi("voteForSuggestion", { suggestionId, userId }),
  getUpcomingMatch: () => callApi("getUpcomingMatch"),
  getCompletedMatches: () => callApi("getCompletedMatches"),
  getAttendance: (matchId: string) => callApi("getAttendance", { matchId }),
  setAttendance: (matchId: string, userId: string, userName: string, status: string) =>
    callApi("setAttendance", { matchId, userId, userName, status }),
  getMatchPreferences: (matchId: string) => callApi("getMatchPreferences", { matchId }),
  setMatchPreferences: (matchId: string, userId: string, data: any) =>
    callApi("setMatchPreferences", { matchId, userId, ...data }),
  generateTeams: (matchId: string) => callApi("generateTeams", { matchId }),
  getTeamDivision: (matchId: string) => callApi("getTeamDivision", { matchId }),
  submitTeamDivisionVote: (matchId: string, userId: string, rating: number, comment: string) =>
    callApi("submitTeamDivisionVote", { matchId, userId, rating, comment }),
  getMatchAwards: (matchId: string) => callApi("getMatchAwards", { matchId }),
  submitVote: (matchId: string, voterId: string, votes: any) => callApi("submitVote", { matchId, voterId, votes }),
  getMatchEvaluations: (matchId: string) => callApi("getMatchEvaluations", { matchId }),
  submitMatchEvaluation: (matchId: string, userId: string, rating: number, comment: string) =>
    callApi("submitMatchEvaluation", { matchId, userId, rating, comment }),
  getChatMessages: () => callApi("getChatMessages"),
  sendChatMessage: (senderId: string, senderName: string, text: string) => callApi("sendChatMessage", { senderId, senderName, text }),
};
