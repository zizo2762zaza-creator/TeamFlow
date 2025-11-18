import React, { useState } from "react";
import api from "../services/api";

interface Props {
  onLoggedIn: (user: any) => void;
}

export default function AutoLogin({ onLoggedIn }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await api.login(email);

    if (res.ok) {
      onLoggedIn(res.user);
      localStorage.setItem("teamflow_user", JSON.stringify(res.user));
    } else {
      setError("فشل تسجيل الدخول. تأكد من بريد الجامعة.");
    }

    setLoading(false);
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl text-white w-[360px]">
      <h1 className="text-2xl font-bold mb-4">TeamFlow — تسجيل دخول</h1>
      <p className="text-slate-300 mb-4">
        أدخل بريد الجامعة لتسجيل الدخول. سيتم حفظه ولن يُطلب مرة أخرى.
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded bg-slate-700 border border-slate-600"
          placeholder="email@univ-ghardaia.edu.dz"
        />

        <button
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-bold rounded-lg"
        >
          {loading ? "جاري التحقق..." : "تسجيل الدخول"}
        </button>

        {error && <p className="text-red-400">{error}</p>}
      </form>
    </div>
  );
}
