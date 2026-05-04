import { Link } from "react-router-dom";
import { Users, Building2, BookOpen, FileCheck, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

const stats = [
  { label: "Total Users", value: "15,234", icon: Users, change: "+320 this month" },
  { label: "Companies", value: "124", icon: Building2, change: "+8 this month" },
  { label: "Simulations", value: "512", icon: BookOpen, change: "+34 this month" },
  { label: "Submissions", value: "42,891", icon: FileCheck, change: "+2,100 this week" },
];

const activity = [
  { type: "user", msg: "New company registered: DataStream Inc.", time: "15 min ago" },
  { type: "review", msg: "Simulation 'Python Challenge' submitted for review", time: "1h ago" },
  { type: "alert", msg: "Reported content on simulation #234", time: "2h ago" },
  { type: "user", msg: "50 new user signups today", time: "3h ago" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
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
        <div className="border border-gray-100 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-5 space-y-2">
            <Link to="/admin/templates" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 no-underline text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-gray-400" /> Manage Templates</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link to="/admin/review" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 no-underline text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gray-400" /> Review Queue</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gray-400" /> Platform Analytics</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 border border-gray-100 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-5 space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  a.type === "alert" ? "bg-red-100" : a.type === "review" ? "bg-yellow-100" : "bg-blue-100"
                }`}>
                  {a.type === "alert" ? <AlertTriangle className="w-4 h-4 text-red-600" /> : a.type === "review" ? <FileCheck className="w-4 h-4 text-yellow-600" /> : <Users className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm text-gray-700">{a.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
