import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

export default function Attendance() {
  const [players, setPlayers] = useState<any[]>([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    (async () => {
      const res = await api.getAllUsers();
      if (res.ok) {
        setPlayers(res);
        setStatus("done");
      } else {
        setStatus("error");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Link to="/" className="text-blue-400">← رجوع</Link>
      <h1 className="text-3xl font-bold mb-6">الحضور</h1>

      {status === "loading" && <p>جاري التحميل...</p>}

      {status === "done" && (
        <table className="w-full text-left bg-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4">اللاعب</th>
              <th className="p-4">الإيميل</th>
              <th className="p-4">حاضر؟</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p: any) => (
              <tr key={p.id} className="border-b border-slate-700">
                <td className="p-4">{p.name}</td>
                <td className="p-4 text-slate-400">{p.email}</td>
                <td className="p-4">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded">
                    نعم
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
