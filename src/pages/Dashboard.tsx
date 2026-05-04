import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  BookOpen,
  Trophy,
  Clock,
  ArrowRight,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Simulations Completed", value: "7", icon: BookOpen, change: "+2 this month" },
  { label: "Certificates Earned", value: "4", icon: Trophy, change: "+1 this month" },
  { label: "Hours Practiced", value: "18", icon: Clock, change: "+5 this week" },
  { label: "Profile Views", value: "32", icon: TrendingUp, change: "+12 this week" },
];

const inProgress = [
  { id: "1", title: "Marketing Campaign Strategy", company: "TechCorp Azerbaijan", progress: 65, lastActive: "2h ago" },
  { id: "2", title: "Full-Stack Bug Fix Challenge", company: "DevHub", progress: 30, lastActive: "1d ago" },
];

const certs = [
  { id: "1", title: "Financial Analysis Report", company: "AzFinance", status: "approved", date: "Nov 15" },
  { id: "2", title: "UX Research & Wireframing", company: "DesignLab", status: "pending", date: "Nov 20" },
];

const messages = [
  { from: "TechCorp Azerbaijan", preview: "Great performance on the marketing sim!", time: "3h ago" },
  { from: "DesignLab Baku", preview: "Your certificate is under review.", time: "1d ago" },
];

const certColors: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("dash.title")}</h1>
        <p className="text-gray-500 mt-1">
          {t("dash.welcome")} {profile?.displayName && `— ${profile.displayName}`}
        </p>
      </div>

      {/* Stats */}
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
        <div className="lg:col-span-2 space-y-6">
          {/* In Progress */}
          <div className="border border-gray-100 rounded-2xl bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">{t("dash.in_progress")}</h2>
              <Link to="/explore" className="text-sm font-medium text-primary flex items-center gap-1 no-underline">
                {t("dash.browse_more")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="p-5 space-y-4">
              {inProgress.map((sim) => (
                <div key={sim.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{sim.title}</p>
                    <p className="text-xs text-gray-400">{sim.company}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${sim.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{sim.progress}%</span>
                    </div>
                  </div>
                  <Link
                    to={`/workspace/${sim.id}`}
                    className="text-sm font-medium bg-gradient-to-b from-gray-700 to-gray-900 text-white py-1.5 px-4 rounded-xl no-underline hover:brightness-110 transition"
                  >
                    {t("dash.continue")}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="border border-gray-100 rounded-2xl bg-white">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">{t("dash.certificates")}</h2>
            </div>
            <div className="p-5 space-y-3">
              {certs.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.company} · {c.date}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${certColors[c.status]}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border border-gray-100 rounded-2xl bg-white">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-900">{t("dash.messages")}</h2>
            </div>
            <div className="p-5 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-gray-900">{m.from}</p>
                    <span className="text-xs text-gray-400">{m.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.preview}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl bg-white p-6 text-center">
            <Trophy className="w-10 h-10 text-primary/30 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Keep going!</h3>
            <p className="text-xs text-gray-500 mb-4">
              Complete 3 more simulations to unlock your next achievement.
            </p>
            <Link
              to="/explore"
              className="inline-block text-sm font-medium border border-gray-200 text-gray-700 py-1.5 px-4 rounded-xl no-underline hover:bg-gray-50 transition"
            >
              {t("nav.explore")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
