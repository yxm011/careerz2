import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Building2, Users, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";

interface Block {
  id: string;
  type: string;
  content: string;
  order: number;
}

interface Simulation {
  title: string;
  companyName: string;
  category: string;
  difficulty: string;
  duration: number;
  description: string;
  blocks: Block[];
  status: string;
}

const diffColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function SimDetail() {
  const { id } = useParams();
  const { profile } = useAuth();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [stats, setStats] = useState({ completions: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      // Show loading immediately
      setLoading(true);
      loadSimulation();
    }
  }, [id]);

  async function loadSimulation() {
    if (!id) return;
    try {
      const simDoc = await getDoc(doc(db, "simulations", id));
      if (!simDoc.exists()) {
        setError("Simulation not found");
        return;
      }
      const data = simDoc.data() as Simulation;
      if (data.status !== "active") {
        setError("This simulation is not available");
        return;
      }
      setSimulation(data);

      // Load stats
      const subsQuery = query(
        collection(db, "submissions"),
        where("simulationId", "==", id)
      );
      const subsSnap = await getDocs(subsQuery);
      const completed = subsSnap.docs.filter(d => d.data().status === "completed");
      const avgScore = completed.length > 0
        ? Math.round(completed.reduce((sum, d) => sum + (d.data().score || 0), 0) / completed.length)
        : 0;
      
      setStats({
        completions: completed.length,
        avgScore,
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to load simulation");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8 animate-pulse">
          <div className="lg:col-span-2">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-4">
          {error || "Simulation not found"}
        </div>
        <Link to="/explore" className="text-primary hover:underline">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500 capitalize">
                {simulation.category}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${diffColors[simulation.difficulty] || "bg-gray-100 text-gray-600"}`}>
                {simulation.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{simulation.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />{simulation.companyName || "Unknown Company"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />{simulation.duration} minutes
              </span>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About this Simulation</h2>
            <p className="text-gray-500 leading-relaxed">{simulation.description}</p>
          </div>

          {simulation.blocks && simulation.blocks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What You'll Do</h2>
              <div className="space-y-3">
                {simulation.blocks.map((block, i) => (
                  <div key={block.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 capitalize">{block.type.replace("_", " ")}</p>
                      <p className="text-xs text-gray-400">Step {i + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-2xl bg-white p-6 space-y-4">
            {profile ? (
              <Link
                to={`/workspace/${id}`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-3 px-6 rounded-xl no-underline hover:brightness-110 transition text-sm"
              >
                Start Simulation
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to={`/login?redirect=/workspace/${id}`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-blue-600 to-blue-700 text-white font-medium py-3 px-6 rounded-xl no-underline hover:brightness-110 transition text-sm"
              >
                Login to Start
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{stats.completions}</p>
                <p className="text-xs text-gray-500">Completions</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{stats.avgScore}%</p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl bg-white p-6">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">What you'll need</h3>
            <ul className="space-y-2 list-none p-0">
              {[
                "A computer with internet access",
                `About ${simulation.duration} minutes of uninterrupted time`,
                `Basic knowledge of ${simulation.category}`,
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
