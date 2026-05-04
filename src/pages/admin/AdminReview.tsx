import { CheckCircle2, XCircle, Eye, AlertTriangle, FileCheck } from "lucide-react";

const items = [
  { id: "1", type: "simulation", title: "Python Data Challenge", by: "DataStream Inc.", date: "Dec 2, 2025", priority: "normal" },
  { id: "2", type: "simulation", title: "Sales Negotiation Pro", by: "SalesForce AZ", date: "Dec 1, 2025", priority: "normal" },
  { id: "3", type: "report", title: "Inappropriate content in simulation #234", by: "User Report", date: "Nov 30, 2025", priority: "high" },
  { id: "4", type: "simulation", title: "Healthcare Data Analysis", by: "MedTech AZ", date: "Nov 29, 2025", priority: "normal" },
  { id: "5", type: "report", title: "Spam content in job listing #89", by: "User Report", date: "Nov 28, 2025", priority: "high" },
];

const priorityColors: Record<string, string> = { high: "bg-red-100 text-red-700", normal: "bg-blue-100 text-blue-700" };
const typeColors: Record<string, string> = { simulation: "bg-purple-100 text-purple-700", report: "bg-orange-100 text-orange-700" };

export default function AdminReview() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-gray-500 mt-1">Moderate content and review submissions</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 border border-gray-100 rounded-2xl bg-white p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            <p className="text-xs text-gray-500">Pending Reviews</p>
          </div>
        </div>
        <div className="flex-1 border border-gray-100 rounded-2xl bg-white p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{items.filter((i) => i.priority === "high").length}</p>
            <p className="text-xs text-gray-500">High Priority</p>
          </div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Title</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Submitted By</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Priority</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${typeColors[it.type]}`}>{it.type}</span>
                </td>
                <td className="px-5 py-3 font-medium text-gray-900">{it.title}</td>
                <td className="px-5 py-3 text-gray-500">{it.by}</td>
                <td className="px-5 py-3 text-gray-400">{it.date}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${priorityColors[it.priority]}`}>{it.priority}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="text-gray-400 hover:text-gray-900 bg-transparent border-none cursor-pointer"><Eye className="w-4 h-4" /></button>
                    <button className="text-green-500 hover:text-green-700 bg-transparent border-none cursor-pointer"><CheckCircle2 className="w-4 h-4" /></button>
                    <button className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"><XCircle className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
