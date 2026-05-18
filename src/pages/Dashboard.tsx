import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

interface Submission {
  id: string;
  simulationId: string;
  simulationTitle: string;
  companyName: string;
  status: string;
  score?: number;
  progress?: number;
  submittedAt?: any;
}

const certColors: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    certificates: 0,
    hours: 0,
  });

  useEffect(() => {
    if (profile) loadUserData();
  }, [profile]);

  async function loadUserData() {
    if (!profile) return;
    try {
      const subsQuery = query(
        collection(db, "submissions"),
        where("userId", "==", profile.uid)
      );
      const snap = await getDocs(subsQuery);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Submission[];
      
      setSubmissions(data);
      
      // Calculate stats
      const completed = data.filter(s => s.status === "completed").length;
      const certificates = data.filter(s => s.status === "approved" || s.status === "completed").length;
      
      setStats({
        completed,
        certificates,
        hours: Math.round(completed * 0.75), // Rough estimate
      });
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  }

  const inProgress = submissions.filter(s => s.status === "in_progress");
  const certs = submissions.filter(s => s.status === "completed" || s.status === "approved");

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
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.completed}</p>
          <p className="text-xs text-gray-500">Simulations Completed</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.certificates}</p>
          <p className="text-xs text-gray-500">Certificates Earned</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.hours}</p>
          <p className="text-xs text-gray-500">Hours Practiced</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : inProgress.length}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
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
              {loading ? (
                <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
              ) : inProgress.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No simulations in progress. Start one from Explore!</p>
              ) : (
                inProgress.map((sim) => (
                  <div key={sim.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{sim.simulationTitle || "Untitled"}</p>
                      <p className="text-xs text-gray-400">{sim.companyName || "Unknown Company"}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${sim.progress || 0}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">{sim.progress || 0}%</span>
                      </div>
                    </div>
                    <Link
                      to={`/workspace/${sim.simulationId}`}
                      className="text-sm font-medium bg-gradient-to-b from-gray-700 to-gray-900 text-white py-1.5 px-4 rounded-xl no-underline hover:brightness-110 transition"
                    >
                      {t("dash.continue")}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certificates */}
          <div className="border border-gray-100 rounded-2xl bg-white">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">{t("dash.certificates")}</h2>
            </div>
            <div className="p-5 space-y-3">
              {loading ? (
                <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
              ) : certs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No certificates yet. Complete simulations to earn them!</p>
              ) : (
                certs.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{c.simulationTitle || "Untitled"}</p>
                      <p className="text-xs text-gray-400">
                        {c.companyName || "Unknown"} · {c.submittedAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${certColors[c.status] || "bg-gray-100 text-gray-600"}`}>
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

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
