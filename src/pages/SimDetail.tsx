import { useParams, Link } from "react-router-dom";
import { Clock, Building2, Users, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";

const MOCK_SIM = {
  id: "1",
  title: "Marketing Campaign Strategy",
  company: "TechCorp Azerbaijan",
  category: "Marketing",
  difficulty: "intermediate" as const,
  duration_minutes: 45,
  description:
    "In this simulation, you will step into the role of a Digital Marketing Manager at a fintech startup launching in Baku. You'll research the target audience, define campaign goals, select channels, create ad copy, and present a comprehensive campaign plan.",
  blocks: [
    { title: "Company & Role Overview", type: "rich_text" },
    { title: "Market Research Quiz", type: "multiple_choice" },
    { title: "Target Audience Analysis", type: "rich_text" },
    { title: "Campaign Strategy Document", type: "file_upload" },
    { title: "Ad Copy Creation", type: "rich_text" },
    { title: "Budget Allocation Scenario", type: "scenario" },
  ],
  skills: ["Digital Marketing", "Campaign Planning", "Copywriting", "Analytics", "Budget Management"],
  completions: 234,
  avgScore: 78,
};

const diffColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function SimDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded-lg border border-gray-200 text-gray-500">
                {MOCK_SIM.category}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${diffColors[MOCK_SIM.difficulty]}`}>
                {MOCK_SIM.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{MOCK_SIM.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />{MOCK_SIM.company}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />{MOCK_SIM.duration_minutes} minutes
              </span>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About this Simulation</h2>
            <p className="text-gray-500 leading-relaxed">{MOCK_SIM.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What You'll Do</h2>
            <div className="space-y-3">
              {MOCK_SIM.blocks.map((block, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{block.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{block.type.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills You'll Demonstrate</h2>
            <div className="flex flex-wrap gap-2">
              {MOCK_SIM.skills.map((skill) => (
                <span key={skill} className="text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-2xl bg-white p-6 space-y-4">
            <Link
              to={`/workspace/${id}`}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-3 px-6 rounded-xl no-underline hover:brightness-110 transition text-sm"
            >
              Start Simulation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{MOCK_SIM.completions}</p>
                <p className="text-xs text-gray-500">Completions</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{MOCK_SIM.avgScore}%</p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl bg-white p-6">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">What you'll need</h3>
            <ul className="space-y-2 list-none p-0">
              {[
                "A computer with internet access",
                `About ${MOCK_SIM.duration_minutes} minutes of uninterrupted time`,
                "Basic knowledge of marketing concepts",
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
