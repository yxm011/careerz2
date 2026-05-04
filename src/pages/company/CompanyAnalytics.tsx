import { Users, TrendingUp, Clock, Award, BarChart3 } from "lucide-react";

const stats = [
  { label: "Total Submissions", value: "48", icon: Users },
  { label: "Avg Score", value: "78%", icon: TrendingUp },
  { label: "Avg Time", value: "38 min", icon: Clock },
  { label: "Certificate Rate", value: "65%", icon: Award },
];

const distribution = [
  { range: "90-100%", count: 8, pct: 17 },
  { range: "80-89%", count: 14, pct: 29 },
  { range: "70-79%", count: 12, pct: 25 },
  { range: "60-69%", count: 9, pct: 19 },
  { range: "Below 60%", count: 5, pct: 10 },
];

const top = [
  { name: "Orhan Aliyev", score: 95, time: "32 min" },
  { name: "Aydan Mammadov", score: 91, time: "35 min" },
  { name: "Nigar Safarova", score: 88, time: "41 min" },
  { name: "Leyla Hasanova", score: 85, time: "38 min" },
];

export default function CompanyAnalytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Simulation Analytics</h1>
        <p className="text-gray-500 mt-1">Marketing Campaign Strategy — Performance Overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-gray-100 rounded-2xl bg-white p-5">
            <s.icon className="w-5 h-5 text-gray-400 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-gray-100 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Score Distribution</h2>
          </div>
          <div className="p-5 space-y-3">
            {distribution.map((b) => (
              <div key={b.range} className="flex items-center gap-3">
                <span className="text-sm w-20 shrink-0 text-gray-600">{b.range}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="text-sm font-medium w-16 text-right text-gray-700">{b.count} ({b.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-100 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Top Candidates</h2>
          </div>
          <div className="p-5 space-y-3">
            {top.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.time}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">{c.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
