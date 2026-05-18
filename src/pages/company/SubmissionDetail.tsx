import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, User, Calendar, Award, Clock } from "lucide-react";

interface Submission {
  userName: string;
  simulationTitle: string;
  companyName: string;
  status: string;
  score: number;
  progress: number;
  answers: Record<string, string>;
  submittedAt: any;
  startedAt: any;
}

interface Block {
  id: string;
  type: string;
  content: string;
  order: number;
}

interface Simulation {
  blocks: Block[];
}

export default function SubmissionDetail() {
  const { submissionId } = useParams();
  const { profile } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (submissionId && profile) loadSubmission();
  }, [submissionId, profile]);

  async function loadSubmission() {
    if (!submissionId || !profile) return;
    try {
      const subDoc = await getDoc(doc(db, "submissions", submissionId));
      if (!subDoc.exists()) {
        setError("Submission not found");
        return;
      }
      const subData = subDoc.data() as Submission & { simulationId: string; companyId: string };
      
      // Check if this company owns the submission
      if (subData.companyId !== profile.uid) {
        setError("You don't have permission to view this submission");
        return;
      }
      
      setSubmission(subData);

      // Load simulation to get block details
      const simDoc = await getDoc(doc(db, "simulations", subData.simulationId));
      if (simDoc.exists()) {
        setSimulation(simDoc.data() as Simulation);
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to load submission");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-center text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-4">
          {error || "Submission not found"}
        </div>
        <Link to="/company/submissions" className="text-primary hover:underline">
          ← Back to Submissions
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    in_progress: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/company/submissions" className="text-gray-400 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{submission.simulationTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Submission by {submission.userName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-100 rounded-2xl bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Score</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{submission.score}%</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{submission.progress}%</p>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Status</span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${statusColors[submission.status] || "bg-gray-100 text-gray-600"}`}>
            {submission.status.replace("_", " ")}
          </span>
        </div>
        <div className="border border-gray-100 rounded-2xl bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Submitted</span>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {submission.submittedAt?.toDate?.()?.toLocaleDateString() || "In progress"}
          </p>
        </div>
      </div>

      {/* Answers */}
      <div className="border border-gray-100 rounded-2xl bg-white">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Candidate Responses</h2>
        </div>
        <div className="p-6 space-y-6">
          {simulation?.blocks && simulation.blocks.length > 0 ? (
            simulation.blocks.map((block, i) => {
              const answer = submission.answers[block.id];
              return (
                <div key={block.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500 capitalize">
                          {block.type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-2">{block.content}</p>
                      {answer ? (
                        <div className="bg-gray-50 rounded-xl p-4 mt-3">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4 mt-3">
                          <p className="text-sm text-gray-400 italic">No answer provided</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No responses available</p>
          )}
        </div>
      </div>
    </div>
  );
}
