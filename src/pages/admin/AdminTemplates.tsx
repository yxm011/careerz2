import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";

const TEMPLATES = [
  { id: "1", title: "Marketing Basics", category: "Marketing", blocks: 6, usedBy: 12, status: "published" },
  { id: "2", title: "Software Engineering Challenge", category: "Engineering", blocks: 8, usedBy: 24, status: "published" },
  { id: "3", title: "Financial Modeling", category: "Finance", blocks: 5, usedBy: 8, status: "draft" },
  { id: "4", title: "UX Design Process", category: "Design", blocks: 7, usedBy: 15, status: "published" },
  { id: "5", title: "Sales Fundamentals", category: "Sales", blocks: 4, usedBy: 0, status: "draft" },
];

const statusColors: Record<string, string> = { published: "bg-green-100 text-green-700", draft: "bg-gray-100 text-gray-600" };

export default function AdminTemplates() {
  const [search, setSearch] = useState("");
  const filtered = TEMPLATES.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Templates</h1>
          <p className="text-gray-500 mt-1">Manage reusable simulation templates</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition cursor-pointer border-none text-sm">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input placeholder="Search templates..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="border border-gray-100 rounded-2xl bg-white p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500">{t.category}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${statusColors[t.status]}`}>{t.status}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.blocks} blocks · Used by {t.usedBy} companies</p>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 text-sm font-medium border border-gray-200 text-gray-700 py-1.5 rounded-xl hover:bg-gray-50 transition cursor-pointer bg-white">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button className="text-sm border border-gray-200 text-gray-700 py-1.5 px-3 rounded-xl hover:bg-gray-50 transition cursor-pointer bg-white">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button className="text-sm border border-gray-200 text-red-500 py-1.5 px-3 rounded-xl hover:bg-red-50 transition cursor-pointer bg-white">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
