import { Link } from "react-router-dom";

export default function Matches() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Link to="/" className="text-blue-400">← رجوع</Link>

      <h1 className="text-3xl font-bold mb-6">المباريات</h1>

      <p className="text-slate-300">
        هنا ستتمكن لاحقًا من:
      </p>

      <ul className="list-disc pr-6 text-slate-400 mt-3">
        <li>إضافة مباراة جديدة</li>
        <li>تسجيل النتيجة</li>
        <li>إدارة تشكيل الفريق</li>
      </ul>

      <div className="mt-6 p-6 bg-slate-800 rounded-xl">
        <p className="text-slate-300">المميزات ستضاف قريبًا…</p>
      </div>
    </div>
  );
}
