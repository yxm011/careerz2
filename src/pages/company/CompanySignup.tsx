import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useLanguage } from "@/i18n/LanguageContext";
import { Building2, Lock, Mail, Loader2 } from "lucide-react";

export default function CompanySignup() {
  const [form, setForm] = useState({ companyName: "", industry: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.companyName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.companyName });
      // Write profile to Firestore with timeout so it doesn't hang
      const firestoreWrite = setDoc(doc(db, "users", cred.user.uid), {
        displayName: form.companyName,
        email: form.email,
        role: "company",
        industry: form.industry,
        createdAt: new Date().toISOString(),
      });
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timed out")), 8000)
      );
      try {
        await Promise.race([firestoreWrite, timeout]);
      } catch {
        console.warn("Firestore write failed or timed out — continuing anyway");
      }
      navigate("/company");
    } catch (err: any) {
      setError(err.message ?? "Signup failed.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] w-full flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-black/5 p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-black/5">
          <Building2 className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">Enterprise Sign Up</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Create simulations and discover top talent
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
            required
          />
          <select
            value={form.industry}
            onChange={(e) => update("industry", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm cursor-pointer"
          >
            <option value="">Select Industry</option>
            <option value="technology">Technology</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
          </select>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Work Email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
              required
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password (min 6 chars)"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
              required
              minLength={6}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition disabled:opacity-50 border-none text-sm mt-2"
          >
            {loading ? "Creating..." : "Create Company Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
