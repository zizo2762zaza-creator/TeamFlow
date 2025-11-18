import { Link } from "react-router-dom";

export default function Dashboard({ user }: any) {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">الصفحة الرئيسية ⚽</h1>
      <p className="text-slate-300 mb-8">
        أهلاً <span className="font-semibold">{user.name}</span> 👋  
        إليك لوحة التحكم الخاصة بك.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/attendance" className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
          <h2 className="text-xl font-bold mb-2">الحضور</h2>
          <p className="text-slate-300">إدارة وتسجيل حضور اللاعبين.</p>
        </Link>

        <Link to="/matches" className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
          <h2 className="text-xl font-bold mb-2">المباريات</h2>
          <p className="text-slate-300">تسجيل نتائج المباريات القادمة والسابقة.</p>
        </Link>

        <Link to="/profile" className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
          <h2 className="text-xl font-bold mb-2">الملف الشخصي</h2>
          <p className="text-slate-300">تحديث بياناتك ومهاراتك.</p>
        </Link>
      </div>
    </div>
  );
}
