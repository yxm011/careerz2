import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical } from "lucide-react";

interface Block {
  id: string;
  type: "text" | "question" | "code" | "multiple_choice" | "file_upload" | "scenario" | "drag_drop";
  content: string;
  order: number;
  options?: string[];
  correctAnswer?: number;
  modelAnswer?: string;
  choices?: { label: string; outcome: string; isCorrect?: boolean }[];
  items?: string[];
  categories?: string[];
  correctMatches?: Record<string, string>;
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
            <button
              onClick={() => addBlock("scenario")}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-lg transition font-medium"
            >
              + Scenario
            </button>
            <button
              onClick={() => addBlock("drag_drop")}
              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg transition font-medium"
            >
              + Drag & Drop
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
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-600">Options:</label>
                        <button
                          onClick={() => {
                            const newOptions = [...(block.options || []), ""];
                            updateBlockField(block.id, "options", newOptions);
                          }}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition"
                        >
                          + Add Option
                        </button>
                      </div>
                      {(block.options || ["", ""]).map((option, i) => (
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
                              const newOptions = [...(block.options || [])];
                              newOptions[i] = e.target.value;
                              updateBlockField(block.id, "options", newOptions);
                            }}
                            placeholder={`Option ${i + 1}`}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                          />
                          {(block.options?.length || 0) > 2 && (
                            <button
                              onClick={() => {
                                const newOptions = (block.options || []).filter((_, idx) => idx !== i);
                                updateBlockField(block.id, "options", newOptions);
                                // Reset correct answer if it was the deleted option
                                if (block.correctAnswer === i) {
                                  updateBlockField(block.id, "correctAnswer", undefined);
                                } else if (block.correctAnswer !== undefined && block.correctAnswer > i) {
                                  updateBlockField(block.id, "correctAnswer", block.correctAnswer - 1);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-1">Select the correct answer with the radio button (min 2 options)</p>
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
                ) : block.type === "scenario" ? (
                  <div className="space-y-3">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Describe the scenario/situation..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm resize-none"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-600">Choices:</label>
                        <button
                          onClick={() => {
                            const newChoices = [...(block.choices || []), { label: "", outcome: "", isCorrect: false }];
                            updateBlockField(block.id, "choices", newChoices);
                          }}
                          className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded transition"
                        >
                          + Add Choice
                        </button>
                      </div>
                      {(block.choices || [{ label: "", outcome: "", isCorrect: false }, { label: "", outcome: "", isCorrect: false }]).map((choice, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={choice.isCorrect || false}
                              onChange={(e) => {
                                const newChoices = [...(block.choices || [])];
                                newChoices[i] = { ...newChoices[i], isCorrect: e.target.checked };
                                updateBlockField(block.id, "choices", newChoices);
                              }}
                              className="w-4 h-4 text-green-600"
                            />
                            <input
                              type="text"
                              value={choice.label}
                              onChange={(e) => {
                                const newChoices = [...(block.choices || [])];
                                newChoices[i] = { ...newChoices[i], label: e.target.value };
                                updateBlockField(block.id, "choices", newChoices);
                              }}
                              placeholder={`Choice ${i + 1}`}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                            />
                            {(block.choices?.length || 0) > 2 && (
                              <button
                                onClick={() => {
                                  const newChoices = (block.choices || []).filter((_, idx) => idx !== i);
                                  updateBlockField(block.id, "choices", newChoices);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <textarea
                            value={choice.outcome}
                            onChange={(e) => {
                              const newChoices = [...(block.choices || [])];
                              newChoices[i] = { ...newChoices[i], outcome: e.target.value };
                              updateBlockField(block.id, "choices", newChoices);
                            }}
                            placeholder="What happens if they choose this? (outcome/feedback)"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm resize-none"
                          />
                          <p className="text-xs text-gray-500">✓ Check if this is a good/correct choice</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : block.type === "drag_drop" ? (
                  <div className="space-y-3">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Instructions (e.g., 'Match each skill to the correct department')"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm resize-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-600">Items to Match:</label>
                          <button
                            onClick={() => {
                              const newItems = [...(block.items || []), ""];
                              updateBlockField(block.id, "items", newItems);
                            }}
                            className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition"
                          >
                            + Add
                          </button>
                        </div>
                        {(block.items || ["", ""]).map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...(block.items || [])];
                                newItems[i] = e.target.value;
                                updateBlockField(block.id, "items", newItems);
                              }}
                              placeholder={`Item ${i + 1}`}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                            />
                            {(block.items?.length || 0) > 2 && (
                              <button
                                onClick={() => {
                                  const newItems = (block.items || []).filter((_, idx) => idx !== i);
                                  updateBlockField(block.id, "items", newItems);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-600">Categories:</label>
                          <button
                            onClick={() => {
                              const newCategories = [...(block.categories || []), ""];
                              updateBlockField(block.id, "categories", newCategories);
                            }}
                            className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition"
                          >
                            + Add
                          </button>
                        </div>
                        {(block.categories || ["", ""]).map((category, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={category}
                              onChange={(e) => {
                                const newCategories = [...(block.categories || [])];
                                newCategories[i] = e.target.value;
                                updateBlockField(block.id, "categories", newCategories);
                              }}
                              placeholder={`Category ${i + 1}`}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                            />
                            {(block.categories?.length || 0) > 2 && (
                              <button
                                onClick={() => {
                                  const newCategories = (block.categories || []).filter((_, idx) => idx !== i);
                                  updateBlockField(block.id, "categories", newCategories);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Correct Matches:</p>
                      <p className="text-xs text-gray-500">Users will drag items to categories. Define correct matches below:</p>
                      <div className="mt-2 space-y-1">
                        {(block.items || []).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600">{item || `Item ${i + 1}`}</span>
                            <span>→</span>
                            <select
                              value={block.correctMatches?.[item] || ""}
                              onChange={(e) => {
                                const newMatches = { ...(block.correctMatches || {}), [item]: e.target.value };
                                updateBlockField(block.id, "correctMatches", newMatches);
                              }}
                              className="px-2 py-1 rounded border border-gray-200 text-xs"
                            >
                              <option value="">Select category...</option>
                              {(block.categories || []).map((cat, j) => (
                                <option key={j} value={cat}>{cat || `Category ${j + 1}`}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
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
