import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, MapPin, Building2, Briefcase } from "lucide-react";

const MOCK_JOBS = [
  { id: "1", title: "Frontend Developer", company: "TechCorp Azerbaijan", location: "Baku", type: "full-time", salary: "2000-3500 AZN", desc: "Build responsive web apps with React and Next.js.", tags: ["React", "TypeScript", "TailwindCSS"] },
  { id: "2", title: "Marketing Specialist", company: "BrandAZ", location: "Baku", type: "full-time", salary: "1500-2500 AZN", desc: "Drive growth through digital marketing strategies.", tags: ["Google Ads", "SEO", "Analytics"] },
  { id: "3", title: "Data Analyst Intern", company: "DataStream", location: "Remote", type: "internship", salary: "800-1200 AZN", desc: "Analyze datasets and produce actionable insights.", tags: ["Python", "SQL", "Excel"] },
  { id: "4", title: "UX Designer", company: "DesignLab Baku", location: "Baku", type: "contract", salary: "2500-4000 AZN", desc: "Design intuitive user experiences for mobile and web.", tags: ["Figma", "User Research", "Prototyping"] },
  { id: "5", title: "Backend Engineer", company: "DevHub", location: "Baku", type: "full-time", salary: "3000-5000 AZN", desc: "Design and build scalable APIs and microservices.", tags: ["Node.js", "PostgreSQL", "Docker"] },
];

const typeColors: Record<string, string> = {
  "full-time": "bg-blue-100 text-blue-700",
  "part-time": "bg-purple-100 text-purple-700",
  contract: "bg-orange-100 text-orange-700",
  internship: "bg-green-100 text-green-700",
};

export default function Jobs() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const filtered = MOCK_JOBS.filter((j) => {
    const match = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "all" || j.type === type;
    return match && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("jobs.title")}</h1>
        <p className="text-gray-500 mt-2">{t("jobs.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder={t("jobs.search")}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="border border-gray-100 rounded-2xl bg-white p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${typeColors[job.type] ?? "bg-gray-100 text-gray-600"}`}>
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />{job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />{job.location}
                  </span>
                  <span className="font-medium text-gray-700">{job.salary}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{job.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button className="shrink-0 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 px-5 rounded-xl hover:brightness-105 cursor-pointer transition border-none text-sm">
                {t("jobs.apply")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">{t("jobs.empty")}</h3>
        </div>
      )}
    </div>
  );
}
