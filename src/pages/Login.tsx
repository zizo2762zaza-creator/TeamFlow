import { useState } from "react";
import { api } from "../services/api";

export default function Login({ onLogin }: { onLogin: Function }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    setError("");

    const res = await api.login(email);

    if (!res.ok) {
      setError("البريد غير موجود في النظام");
      setLoading(false);
      return;
    }

    // حفظ الجلسة
    localStorage.setItem("tf_user", JSON.stringify(res.user));

    onLogin(res.user); // الرجوع إلى التطبيق
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-[350px] text-center">
        <h1 className="text-white text-2xl font-bold mb-4">تسجيل الدخول</h1>

        <input
          type="email"
          placeholder="example@univ-ghardaia.edu.dz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded mb-4 bg-gray-700 text-white"
        />

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <button
          disabled={loading}
          onClick={handle}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {loading ? "جاري التحقق..." : "تسجيل الدخول"}
        </button>
      </div>
    </div>
  );
}
