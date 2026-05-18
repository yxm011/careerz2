import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Users, FileCheck, TrendingUp, Plus, ArrowRight, Eye, Trash2 } from "lucide-react";

interface Simulation {
  id: string;
  title: string;
  status: string;
  submissionCount?: number;
  avgScore?: number;
}

interface Submission {
  id: string;
  userName: string;
  simulationTitle: string;
  score: number;
  submittedAt: any;
}

const statusColors: Record<string, string> = { 
  active: "bg-green-100 text-green-700", 
  draft: "bg-gray-100 text-gray-600",
  archived: "bg-red-100 text-red-700"
};

export default function CompanyDashboard() {
  const { profile } = useAuth();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [recentSubs, setRecentSubs] = useState<Submission[]>([]);
  const [stats, setStats] = useState({
    activeCount: 0,
    totalSubmissions: 0,
    talentPool: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    loadData();
  }, [profile]);

  async function deleteSimulation(simId: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "simulations", simId));
      // Refresh the list
      setSimulations(simulations.filter(s => s.id !== simId));
      // Recalculate stats
      const remaining = simulations.filter(s => s.id !== simId);
      setStats(prev => ({
        ...prev,
        activeCount: remaining.filter(s => s.status === "active").length,
      }));
    } catch (error) {
      console.error("Failed to delete simulation:", error);
      alert("Failed to delete simulation. Please try again.");
    }
  }

  async function loadData() {
    if (!profile) return;
    try {
      // Load simulations (no orderBy to avoid composite index requirement)
      const simsQuery = query(
        collection(db, "simulations"),
        where("companyId", "==", profile.uid)
      );
      const simsSnap = await getDocs(simsQuery);
      const simsData = simsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Simulation[];
      
      // Sort in memory by createdAt
      simsData.sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      
      setSimulations(simsData);

      // Load submissions for this company (no orderBy to avoid composite index)
      const subsQuery = query(
        collection(db, "submissions"),
        where("companyId", "==", profile.uid)
      );
      const subsSnap = await getDocs(subsQuery);
      const subsData = subsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Submission[];
      
      // Sort in memory and take top 5
      subsData.sort((a: any, b: any) => {
        const aTime = a.submittedAt?.toMillis?.() || 0;
        const bTime = b.submittedAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      
      setRecentSubs(subsData.slice(0, 5));

      // Calculate stats
      const activeCount = simsData.filter(s => s.status === "active").length;
      const totalSubs = subsSnap.size;
      const avgScore = subsData.length > 0 
        ? Math.round(subsData.reduce((sum, s) => sum + s.score, 0) / subsData.length)
        : 0;

      setStats({
        activeCount,
        totalSubmissions: totalSubs,
        talentPool: 0, // Will implement later
        avgScore,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }
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
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.activeCount}</p>
          <p className="text-xs text-gray-500">Active Simulations</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <FileCheck className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.totalSubmissions}</p>
          <p className="text-xs text-gray-500">Total Submissions</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.talentPool}</p>
          <p className="text-xs text-gray-500">Talent Pool</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : `${stats.avgScore}%`}</p>
          <p className="text-xs text-gray-500">Avg Score</p>
        </div>
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
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
            ) : simulations.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No simulations yet. Create your first one!</p>
            ) : (
              simulations.map((sim) => (
                <div key={sim.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-gray-900">{sim.title}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${statusColors[sim.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {sim.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {sim.submissionCount || 0} submissions
                      {sim.avgScore ? ` · Avg: ${sim.avgScore}%` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/company/simulations/${sim.id}/edit`} className="text-gray-400 hover:text-gray-900 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteSimulation(sim.id, sim.title)}
                      className="text-gray-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-gray-100 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
          </div>
          <div className="p-5 space-y-3">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
            ) : recentSubs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No submissions yet</p>
            ) : (
              recentSubs.map((s) => (
                <div key={s.id} className="p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-gray-900">{s.userName || "Anonymous"}</p>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500">{s.score}%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {s.simulationTitle || "Untitled"} · {s.submittedAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
