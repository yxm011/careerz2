import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical } from "lucide-react";

interface Block {
  id: string;
  type: "text" | "question" | "code" | "multiple_choice" | "file_upload";
  content: string;
  order: number;
  options?: string[];
  correctAnswer?: number;
  modelAnswer?: string;
}

interface Simulation {
  title: string;
  category: string;
  difficulty: string;
  duration: number;
  description: string;
  status: string;
  blocks: Block[];
  companyId: string;
}

export default function CompanySimEdit() {
  const { simId } = useParams<{ simId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (simId && profile) loadSimulation();
  }, [simId, profile]);

  async function loadSimulation() {
    if (!simId || !profile) return;
    try {
      const docRef = doc(db, "simulations", simId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        setError("Simulation not found");
        return;
      }
      const data = snap.data() as Simulation;
      if (data.companyId !== profile.uid) {
        setError("You don't have permission to edit this simulation");
        return;
      }
      setSimulation(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load simulation");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!simId || !simulation) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "simulations", simId), {
        ...simulation,
        updatedAt: serverTimestamp(),
      });
      alert("Simulation saved!");
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!simId || !simulation) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "simulations", simId), {
        ...simulation,
        status: "active",
        updatedAt: serverTimestamp(),
      });
      navigate("/company");
    } catch (err: any) {
      setError(err.message ?? "Failed to publish");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!simId || !simulation) return;
    if (!confirm(`Are you sure you want to delete "${simulation.title}"? This cannot be undone.`)) {
      return;
    }
    setSaving(true);
    try {
      await deleteDoc(doc(db, "simulations", simId));
      navigate("/company");
    } catch (err: any) {
      setError(err.message ?? "Failed to delete");
      setSaving(false);
    }
  }

  function addBlock(type: Block["type"]) {
    if (!simulation) return;
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
      order: simulation.blocks.length,
    };
    setSimulation({ ...simulation, blocks: [...simulation.blocks, newBlock] });
  }

  function updateBlock(id: string, content: string) {
    if (!simulation) return;
    setSimulation({
      ...simulation,
      blocks: simulation.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    });
  }

  function updateBlockField(id: string, field: string, value: any) {
    if (!simulation) return;
    setSimulation({
      ...simulation,
      blocks: simulation.blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    });
  }

  function deleteBlock(id: string) {
    if (!simulation) return;
    setSimulation({
      ...simulation,
      blocks: simulation.blocks.filter((b) => b.id !== id),
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-center text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error || "Simulation not found"}
        </div>
        <Link to="/company" className="mt-4 inline-block text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/company" className="text-gray-400 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{simulation.title}</h1>
            <p className="text-sm text-gray-500">
              {simulation.category} · {simulation.difficulty} · {simulation.duration} min
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 border border-red-200 text-red-600 font-medium py-2 px-4 rounded-xl hover:bg-red-50 transition text-sm disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-50 transition text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving || simulation.blocks.length === 0}
            className="flex items-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 px-4 rounded-xl hover:brightness-110 transition text-sm disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="border border-gray-100 rounded-2xl bg-white p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={simulation.description}
          onChange={(e) => setSimulation({ ...simulation, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm resize-none"
        />
      </div>

      {/* Blocks */}
      <div className="border border-gray-100 rounded-2xl bg-white p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Simulation Content</h2>
          <div className="flex gap-2">
            <button
              onClick={() => addBlock("text")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              + Text
            </button>
            <button
              onClick={() => addBlock("question")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              + Question
            </button>
            <button
              onClick={() => addBlock("code")}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              + Code
            </button>
            <button
              onClick={() => addBlock("multiple_choice")}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition font-medium"
            >
              + Multiple Choice
            </button>
          </div>
        </div>

        {simulation.blocks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No content yet. Add blocks to build your simulation.
          </div>
        ) : (
          <div className="space-y-3">
            {simulation.blocks.map((block) => (
              <div key={block.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase">{block.type}</span>
                  </div>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {block.type === "multiple_choice" ? (
                  <div className="space-y-3">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Enter question..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm resize-none"
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">Options:</label>
                      {(block.options || ["", "", "", ""]).map((option, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${block.id}`}
                            checked={block.correctAnswer === i}
                            onChange={() => updateBlockField(block.id, "correctAnswer", i)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(block.options || ["", "", "", ""])];
                              newOptions[i] = e.target.value;
                              updateBlockField(block.id, "options", newOptions);
                            }}
                            placeholder={`Option ${i + 1}`}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-1">Select the correct answer with the radio button</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Model Answer (optional):</label>
                      <textarea
                        value={block.modelAnswer || ""}
                        onChange={(e) => updateBlockField(block.id, "modelAnswer", e.target.value)}
                        placeholder="Explain why this is the correct answer..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder={`Enter ${block.type} content...`}
                    rows={block.type === "text" ? 3 : 5}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm resize-none"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}
    </div>
  );
}
