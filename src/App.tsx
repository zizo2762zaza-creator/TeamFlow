import { useState } from "react";
import AutoLogin from "./components/AutoLogin";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState<any | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("teamflow_user") || "null");
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("teamflow_user");
    localStorage.removeItem("teamflow_email");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <AutoLogin onLoggedIn={setUser} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <button
        className="fixed bottom-6 left-6 bg-red-600 px-4 py-2 rounded-lg"
        onClick={handleLogout}
      >
        تسجيل الخروج
      </button>
    </BrowserRouter>
  );
}
