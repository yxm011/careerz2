import { useState } from "react";
import { Search, Star, Mail } from "lucide-react";

const TALENT = [
  { id: "1", name: "Orhan Aliyev", email: "orhan@email.com", sims: 5, avg: 91, skills: ["Financial Analysis", "Data Viz", "Excel"], certs: 4 },
  { id: "2", name: "Aydan Mammadov", email: "aydan@email.com", sims: 4, avg: 85, skills: ["Digital Marketing", "Copywriting", "Analytics"], certs: 3 },
  { id: "3", name: "Kamila Aliyeva", email: "kamila@email.com", sims: 6, avg: 88, skills: ["React", "TypeScript", "Node.js"], certs: 5 },
  { id: "4", name: "Leyla Hasanova", email: "leyla@email.com", sims: 3, avg: 79, skills: ["UX Design", "Figma", "Research"], certs: 2 },
  { id: "5", name: "Tural Ibrahimov", email: "tural@email.com", sims: 4, avg: 82, skills: ["Python", "SQL", "ML"], certs: 3 },
];

export default function TalentPool() {
  const [search, setSearch] = useState("");
  const filtered = TALENT.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Talent Pool</h1>
        <p className="text-gray-500 mt-1">Discover candidates based on simulation performance</p>
      </div>
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input placeholder="Search by name or skill..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="border border-gray-100 rounded-2xl bg-white p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-400">{c.email}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{c.avg}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-center">
              <div className="p-2 rounded-xl bg-gray-50">
                <p className="text-lg font-bold text-gray-900">{c.sims}</p>
                <p className="text-xs text-gray-500">Simulations</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50">
                <p className="text-lg font-bold text-gray-900">{c.certs}</p>
                <p className="text-xs text-gray-500">Certificates</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {c.skills.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500">{s}</span>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl hover:brightness-110 transition cursor-pointer border-none text-sm">
              <Mail className="w-3.5 h-3.5" /> Contact
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
