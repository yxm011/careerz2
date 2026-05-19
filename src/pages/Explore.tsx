import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, Clock, Building2, BarChart3 } from "lucide-react";

interface Simulation {
  id: string;
  title: string;
  companyName: string;
  category: string;
  difficulty: string;
  duration: number;
  description: string;
}

const categories = ["All", "engineering", "marketing", "finance", "design", "sales"];

const diffColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function Explore() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimulations();
  }, []);

  async function loadSimulations() {
    try {
      // Set a timeout to auto-retry if taking too long
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn("Firestore query taking longer than expected, forcing refresh...");
          window.location.reload();
        }
      }, 8000);

      // Load all simulations and filter in memory
      const snap = await getDocs(collection(db, "simulations"));
      clearTimeout(timeoutId);
      
      const data = snap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((sim: any) => sim.status === "active") as Simulation[];
      setSimulations(data);
    } catch (error) {
      console.error("Failed to load simulations:", error);
      // Auto-retry on error
      setTimeout(() => {
        console.log("Retrying...");
        window.location.reload();
      }, 1000);
    } finally {
      setLoading(false);
    }
  }

  const filtered = simulations.filter((sim) => {
    const matchSearch = sim.title.toLowerCase().includes(search.toLowerCase()) || 
                       sim.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || sim.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("explore.title")}</h1>
        <p className="text-gray-500 mt-2">{t("explore.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder={t("explore.search")}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition ${
                category === cat
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat === "All" ? t("explore.all") : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-100 rounded-2xl bg-white p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">{t("explore.empty")}</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sim) => (
            <Link
              key={sim.id}
              to={`/sim/${sim.id}`}
              className="border border-gray-100 rounded-2xl bg-white p-5 hover:shadow-md transition-shadow no-underline group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${diffColors[sim.difficulty] || "bg-gray-100 text-gray-600"}`}>
                  {sim.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {sim.duration} min
                </span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {sim.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
                <Building2 className="w-3.5 h-3.5" />
                {sim.companyName || "Unknown Company"}
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{sim.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500 capitalize">
                  {sim.category}
                </span>
                <span className="text-sm font-medium text-primary">
                  {t("explore.view")} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
