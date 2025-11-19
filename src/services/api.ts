const BASE = "/api";  // مهم جدًا

async function callApi(data: any) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}

export const api = {
  login(email: string) {
    return callApi({ action: "login", payload: { email } });
  },
  getUpcomingMatch() {
    return callApi({ action: "getUpcomingMatch" });
  },
  getUsers() {
    return callApi({ action: "getAllUsers" });
  }
};
