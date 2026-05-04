import { useState } from "react";
import { Search, Eye } from "lucide-react";

const MOCK = [
  { id: "1", name: "Aydan Mammadov", sim: "Marketing Campaign Strategy", score: 85, status: "completed", date: "Dec 1, 2025" },
  { id: "2", name: "Leyla Hasanova", sim: "Full-Stack Bug Fix Challenge", score: 72, status: "reviewed", date: "Nov 30, 2025" },
  { id: "3", name: "Orhan Aliyev", sim: "Financial Analysis Report", score: 91, status: "completed", date: "Nov 29, 2025" },
  { id: "4", name: "Nigar Safarova", sim: "Marketing Campaign Strategy", score: 68, status: "in_progress", date: "Nov 28, 2025" },
  { id: "5", name: "Tural Ibrahimov", sim: "UX Research & Wireframing", score: 79, status: "completed", date: "Nov 27, 2025" },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  reviewed: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
};

export default function CompanySubmissions() {
  const [search, setSearch] = useState("");

  const filtered = MOCK.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.sim.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
        <p className="text-gray-500 mt-1">Review and manage candidate submissions</p>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search by name or simulation..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Candidate</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Simulation</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Score</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-medium text-gray-900">{s.name}</td>
                <td className="px-5 py-3 text-gray-600">{s.sim}</td>
                <td className="px-5 py-3 text-gray-600">{s.score}%</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${statusColors[s.status]}`}>
                    {s.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">{s.date}</td>
                <td className="px-5 py-3">
                  <button className="text-gray-400 hover:text-gray-900 bg-transparent border-none cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
