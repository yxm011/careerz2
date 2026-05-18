import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Search, Eye } from "lucide-react";

interface Submission {
  id: string;
  userName: string;
  simulationTitle: string;
  score: number;
  status: string;
  submittedAt: any;
}

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  reviewed: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
};

export default function CompanySubmissions() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadSubmissions();
  }, [profile]);

  async function loadSubmissions() {
    if (!profile) return;
    try {
      const subsQuery = query(
        collection(db, "submissions"),
        where("companyId", "==", profile.uid)
      );
      const snap = await getDocs(subsQuery);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Submission[];
      
      // Sort by date
      data.sort((a, b) => {
        const aTime = a.submittedAt?.toMillis?.() || 0;
        const bTime = b.submittedAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = submissions.filter((s) =>
    s.userName?.toLowerCase().includes(search.toLowerCase()) || 
    s.simulationTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
        <p className="text-gray-500 mt-1">Review and manage candidate submissions</p>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search by name or simulation..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-400">Loading submissions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-gray-100 rounded-2xl bg-white">
          <p className="text-gray-400">
            {search ? "No submissions match your search" : "No submissions yet"}
          </p>
        </div>
      ) : (
        <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Candidate</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Simulation</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Score</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900">{s.userName || "Anonymous"}</td>
                  <td className="px-5 py-3 text-gray-600">{s.simulationTitle || "Untitled"}</td>
                  <td className="px-5 py-3 text-gray-600">{s.score || 0}%</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${statusColors[s.status] || "bg-gray-100 text-gray-600"}`}>
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {s.submittedAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                  </td>
                  <td className="px-5 py-3">
                    <Link 
                      to={`/company/submissions/${s.id}`}
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
