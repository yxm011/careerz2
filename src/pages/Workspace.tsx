import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";

interface Block {
  id: string;
  type: string;
  content: string;
  order: number;
}

interface Simulation {
  title: string;
  companyId: string;
  companyName: string;
  category: string;
  difficulty: string;
  duration: number;
  description: string;
  blocks: Block[];
  status: string;
}

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  useEffect(() => {
    if (id && profile) loadSimulationAndCreateSubmission();
  }, [id, profile]);

  async function loadSimulationAndCreateSubmission() {
    if (!id || !profile) return;
    try {
      // Load simulation
      const simDoc = await getDoc(doc(db, "simulations", id));
      if (!simDoc.exists()) {
        setError("Simulation not found");
        return;
      }
      const simData = simDoc.data() as Simulation;
      if (simData.status !== "active") {
        setError("This simulation is not available");
        return;
      }
      setSimulation(simData);

      // Check for existing in-progress submission
      const existingQuery = query(
        collection(db, "submissions"),
        where("userId", "==", profile.uid),
        where("simulationId", "==", id),
        where("status", "==", "in_progress")
      );
      const existingSnap = await getDocs(existingQuery);

      if (!existingSnap.empty) {
        // Resume existing submission
        setIsResuming(true);
        const existingDoc = existingSnap.docs[0];
        const existingData = existingDoc.data();
        setSubmissionId(existingDoc.id);
        setAnswers(existingData.answers || {});
        
        // Restore completed blocks based on answers
        const completed = new Set<string>();
        Object.keys(existingData.answers || {}).forEach(blockId => {
          if (existingData.answers[blockId]) {
            completed.add(blockId);
          }
        });
        setCompletedBlocks(completed);
      } else {
        // Create new submission
        const submissionRef = await addDoc(collection(db, "submissions"), {
          userId: profile.uid,
          userName: profile.displayName || profile.email,
          simulationId: id,
          simulationTitle: simData.title,
          companyId: simData.companyId,
          companyName: simData.companyName,
          status: "in_progress",
          progress: 0,
          answers: {},
          score: 0,
          startedAt: serverTimestamp(),
          submittedAt: null,
        });
        setSubmissionId(submissionRef.id);
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to load simulation");
    } finally {
      setLoading(false);
    }
  }

  async function saveAnswer(blockId: string, answer: string) {
    if (!submissionId) return;
    const newAnswers = { ...answers, [blockId]: answer };
    setAnswers(newAnswers);
    
    // Save to Firestore
    try {
      await updateDoc(doc(db, "submissions", submissionId), {
        answers: newAnswers,
        progress: Math.round((completedBlocks.size / (simulation?.blocks.length || 1)) * 100),
      });
    } catch (error) {
      console.error("Failed to save answer:", error);
    }
  }

  function markComplete() {
    if (!simulation) return;
    const block = simulation.blocks[currentBlock];
    setCompletedBlocks((prev) => new Set([...prev, block.id]));
  }

  function handleNext() {
    if (!simulation) return;
    markComplete();
    if (currentBlock < simulation.blocks.length - 1) {
      setCurrentBlock(currentBlock + 1);
    }
  }

  function handlePrev() {
    if (currentBlock > 0) setCurrentBlock(currentBlock - 1);
  }

  async function handleSubmit() {
    if (!submissionId || !simulation) return;
    setSubmitting(true);
    try {
      // Calculate simple score (percentage of blocks completed)
      const score = Math.round((completedBlocks.size / simulation.blocks.length) * 100);
      
      await updateDoc(doc(db, "submissions", submissionId), {
        status: "completed",
        progress: 100,
        score,
        submittedAt: serverTimestamp(),
      });
      
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-center text-gray-400">Loading simulation...</p>
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

  if (!simulation.blocks || simulation.blocks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 mb-4">
          This simulation has no content yet.
        </div>
        <Link to="/explore" className="text-primary hover:underline">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const block = simulation.blocks[currentBlock];
  const progress = (completedBlocks.size / simulation.blocks.length) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Resume indicator */}
      {isResuming && (
        <div className="bg-blue-50 border-b border-blue-200 py-2 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-blue-700">
              ✓ Resuming your progress - {completedBlocks.size} of {simulation?.blocks.length} sections completed
            </p>
          </div>
        </div>
      )}
      
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-semibold text-gray-900 truncate">{simulation.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{simulation.duration} min</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-medium text-gray-500">
              {completedBlocks.size}/{simulation.blocks.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="border border-gray-100 rounded-2xl bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections</h3>
              <div className="space-y-1">
                {simulation.blocks.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setCurrentBlock(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors border-none cursor-pointer ${
                      i === currentBlock
                        ? "bg-gray-900 text-white"
                        : "bg-transparent text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {completedBlocks.has(b.id) ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-current text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                    )}
                    <span className="truncate capitalize">{b.type.replace("_", " ")}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="border border-gray-100 rounded-2xl bg-white">
              <div className="px-6 py-5 border-b border-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500 capitalize mb-2 inline-block">
                      {block.type.replace("_", " ")}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">Step {currentBlock + 1}</h2>
                  </div>
                  <span className="text-sm text-gray-400">
                    {currentBlock + 1} of {simulation.blocks.length}
                  </span>
                </div>
              </div>
              <div className="px-6 py-6">
                {/* Text Block */}
                {block.type === "text" && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {block.content}
                    </div>
                  </div>
                )}

                {/* Question Block */}
                {block.type === "question" && (
                  <div className="space-y-4">
                    <p className="font-medium text-gray-900">{block.content}</p>
                    <textarea
                      value={answers[block.id] || ""}
                      onChange={(e) => saveAnswer(block.id, e.target.value)}
                      placeholder="Type your answer here..."
                      rows={6}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm resize-none"
                    />
                  </div>
                )}

                {/* Code Block */}
                {block.type === "code" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-2">{block.content}</p>
                    <textarea
                      value={answers[block.id] || ""}
                      onChange={(e) => saveAnswer(block.id, e.target.value)}
                      placeholder="Write your code here..."
                      rows={12}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-900 text-green-400 text-sm resize-none font-mono"
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handlePrev}
                    disabled={currentBlock === 0}
                    className="flex items-center gap-1 text-sm font-medium border border-gray-200 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50 transition cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  {currentBlock === simulation.blocks.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 text-sm font-medium bg-gradient-to-b from-gray-700 to-gray-900 text-white py-2 px-5 rounded-xl hover:brightness-110 transition cursor-pointer border-none disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Submitting..." : "Submit Simulation"}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1 text-sm font-medium bg-gradient-to-b from-gray-700 to-gray-900 text-white py-2 px-5 rounded-xl hover:brightness-110 transition cursor-pointer border-none"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
