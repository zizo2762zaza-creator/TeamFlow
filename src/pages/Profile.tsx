import { Link } from "react-router-dom";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("teamflow_user") || "null");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Link to="/" className="text-blue-400">← رجوع</Link>

      <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>

      {user ? (
        <div className="bg-slate-800 p-6 rounded-xl w-full max-w-lg">
          <p className="mb-3">
            <span className="font-semibold">الاسم:</span> {user.name}
          </p>
          <p className="mb-3">
            <span className="font-semibold">الإيميل:</span> {user.email}
          </p>
          <p className="mb-3">
            <span className="font-semibold">الدور:</span> {user.role}
          </p>
          <p className="mb-3">
            <span className="font-semibold">مستوى المهارة:</span> ⭐ {user.skillLevel}
          </p>
        </div>
      ) : (
        <p>لم يتم العثور على بياناتك.</p>
      )}
    </div>
  );
}
