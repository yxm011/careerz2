import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CompanySimNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "", difficulty: "", duration: "", description: "" });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    navigate("/company/simulations/new-draft/edit");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Simulation</h1>
        <p className="text-gray-500 mt-1">Set up the basics, then build with the block editor.</p>
      </div>

      <div className="border border-gray-100 rounded-2xl bg-white p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              placeholder="e.g., Marketing Campaign Strategy"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm cursor-pointer">
                <option value="">Select</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="design">Design</option>
                <option value="sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm cursor-pointer">
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input type="number" placeholder="45" value={form.duration} onChange={(e) => update("duration", e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea placeholder="What candidates will do..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm resize-none" required />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2.5 rounded-xl hover:brightness-110 transition cursor-pointer border-none text-sm">
            Continue to Builder <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
