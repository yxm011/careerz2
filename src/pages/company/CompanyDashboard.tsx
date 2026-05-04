import { Link } from "react-router-dom";
import { BookOpen, Users, FileCheck, TrendingUp, Plus, ArrowRight, Eye } from "lucide-react";

const stats = [
  { label: "Active Simulations", value: "5", icon: BookOpen, change: "+1 this month" },
  { label: "Total Submissions", value: "142", icon: FileCheck, change: "+28 this week" },
  { label: "Talent Pool", value: "89", icon: Users, change: "+12 this month" },
  { label: "Avg Score", value: "74%", icon: TrendingUp, change: "+3% vs last month" },
];

const simulations = [
  { id: "1", title: "Marketing Campaign Strategy", submissions: 48, avgScore: 78, status: "active" },
  { id: "2", title: "Full-Stack Bug Fix Challenge", submissions: 32, avgScore: 65, status: "active" },
  { id: "3", title: "Financial Analysis Report", submissions: 62, avgScore: 82, status: "active" },
];

const recentSubs = [
  { name: "Aydan Mammadov", sim: "Marketing Campaign", score: 85, time: "2h ago" },
  { name: "Leyla Hasanova", sim: "Bug Fix Challenge", score: 72, time: "5h ago" },
  { name: "Orhan Aliyev", sim: "Financial Analysis", score: 91, time: "1d ago" },
];

const statusColors: Record<string, string> = { active: "bg-green-100 text-green-700", draft: "bg-gray-100 text-gray-600" };

export default function CompanyDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage simulations and discover talent</p>
        </div>
        <Link
          to="/company/simulations/new"
          className="flex items-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 px-4 rounded-xl no-underline hover:brightness-110 transition text-sm"
        >
          <Plus className="w-4 h-4" /> New Simulation
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-gray-100 rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400">{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-gray-100 rounded-2xl bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Your Simulations</h2>
            <Link to="/company/simulations/new" className="text-sm font-medium text-primary flex items-center gap-1 no-underline">
              Create new <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {simulations.map((sim) => (
              <div key={sim.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-gray-900">{sim.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${statusColors[sim.status] ?? ""}`}>{sim.status}</span>
                  </div>
                  <p className="text-xs text-gray-400">{sim.submissions} submissions · Avg: {sim.avgScore}%</p>
                </div>
                <Link to={`/company/simulations/${sim.id}/analytics`} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-100 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
          </div>
          <div className="p-5 space-y-3">
            {recentSubs.map((s, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm text-gray-900">{s.name}</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500">{s.score}%</span>
                </div>
                <p className="text-xs text-gray-400">{s.sim} · {s.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
