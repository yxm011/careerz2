import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileUp,
  CheckCircle2,
  Send,
} from "lucide-react";

interface Block {
  id: string;
  title: string;
  type: string;
  content: {
    html?: string;
    question?: string;
    options?: { label: string }[];
    prompt?: string;
    scenario?: string;
    choices?: { label: string; outcome: string }[];
  };
}

const MOCK_BLOCKS: Block[] = [
  {
    id: "b1",
    title: "Company & Role Overview",
    type: "rich_text",
    content: {
      html: `<h3 style="margin-bottom:8px;font-weight:600">Welcome to TechCorp Azerbaijan!</h3>
<p>You've just joined as the <strong>Digital Marketing Manager</strong> for our new fintech product launching in Baku. The product is a mobile payment app targeting young professionals aged 22-35.</p>
<p style="margin-top:12px"><strong>Key details:</strong></p>
<ul style="margin-top:4px;padding-left:20px"><li>Budget: 15,000 AZN for the first quarter</li><li>Launch date: Q2 2026</li><li>Target market: Baku, with expansion to Ganja</li><li>Competitors: 3 existing payment apps</li></ul>`,
    },
  },
  {
    id: "b2",
    title: "Market Research Quiz",
    type: "multiple_choice",
    content: {
      question: "Based on the brief, which marketing channel would be MOST effective for reaching young professionals (22-35) in Baku?",
      options: [
        { label: "Print newspaper ads" },
        { label: "Instagram and TikTok campaigns" },
        { label: "Radio advertisements" },
        { label: "Billboard advertising only" },
      ],
    },
  },
  {
    id: "b3",
    title: "Campaign Strategy Document",
    type: "file_upload",
    content: {
      prompt: "Upload your campaign strategy document. It should include: campaign objectives, target audience personas, channel strategy, content calendar outline, and KPIs. Accepted formats: PDF, DOCX, or PPTX.",
    },
  },
  {
    id: "b4",
    title: "Budget Allocation Scenario",
    type: "scenario",
    content: {
      scenario: "Your CEO has just informed you that the marketing budget has been cut by 30%. You now have 10,500 AZN instead of 15,000 AZN. How would you reallocate the budget while still achieving your campaign goals?",
      choices: [
        { label: "Cut social media spend, focus on organic only", outcome: "Risk: Slower growth. Organic-only strategies take 3-6 months." },
        { label: "Reduce paid ads but maintain influencer partnerships", outcome: "Balanced approach. Influencers provide social proof at lower cost." },
        { label: "Go all-in on paid ads, cut content creation", outcome: "Risk: High short-term visibility but no sustainable content strategy." },
        { label: "Negotiate with vendors for discounts, keep original plan", outcome: "Smart move. Vendor negotiation can save 15-20%." },
      ],
    },
  },
  {
    id: "b5",
    title: "Final Submission",
    type: "rich_text",
    content: {
      html: `<h3 style="margin-bottom:8px;font-weight:600">Congratulations!</h3>
<p>You've completed all stages of the Marketing Campaign Strategy simulation.</p>
<ul style="margin-top:8px;padding-left:20px"><li>Your submission will be reviewed within 3-5 business days</li><li>You'll receive detailed feedback on each section</li><li>If you score above 70%, you'll earn a verified certificate</li><li>Top performers may be invited for an interview</li></ul>`,
    },
  },
];

export default function Workspace() {
  const { id } = useParams();
  const [currentBlock, setCurrentBlock] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [textResponses, setTextResponses] = useState<Record<string, string>>({});
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());

  const block = MOCK_BLOCKS[currentBlock];
  const progress = (completedBlocks.size / MOCK_BLOCKS.length) * 100;

  function markComplete() {
    setCompletedBlocks((prev) => new Set([...prev, block.id]));
  }

  function handleNext() {
    markComplete();
    if (currentBlock < MOCK_BLOCKS.length - 1) setCurrentBlock(currentBlock + 1);
  }

  function handlePrev() {
    if (currentBlock > 0) setCurrentBlock(currentBlock - 1);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-semibold text-gray-900 truncate">Marketing Campaign Strategy</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>45:00</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-medium text-gray-500">
              {completedBlocks.size}/{MOCK_BLOCKS.length}
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
                {MOCK_BLOCKS.map((b, i) => (
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
                    <span className="truncate">{b.title}</span>
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
                    <h2 className="text-lg font-semibold text-gray-900">{block.title}</h2>
                  </div>
                  <span className="text-sm text-gray-400">
                    {currentBlock + 1} of {MOCK_BLOCKS.length}
                  </span>
                </div>
              </div>
              <div className="px-6 py-6">
                {/* Rich Text */}
                {block.type === "rich_text" && block.content.html && (
                  <div
                    className="text-sm text-gray-600 leading-relaxed [&_h3]:text-gray-900 [&_strong]:text-gray-800 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: block.content.html }}
                  />
                )}

                {/* Multiple Choice */}
                {block.type === "multiple_choice" && (
                  <div className="space-y-4">
                    <p className="font-medium text-gray-900">{block.content.question}</p>
                    <div className="space-y-2">
                      {block.content.options?.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedOptions((p) => ({ ...p, [block.id]: i }))}
                          className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition text-sm ${
                            selectedOptions[block.id] === i
                              ? "border-primary bg-blue-50/50"
                              : "border-gray-200 hover:bg-gray-50 bg-white"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedOptions[block.id] === i ? "border-primary" : "border-gray-300"
                          }`}>
                            {selectedOptions[block.id] === i && (
                              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                {block.type === "file_upload" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">{block.content.prompt}</p>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                      <FileUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Drag & drop your file here</p>
                      <p className="text-xs text-gray-400 mb-4">PDF, DOCX, or PPTX up to 10MB</p>
                      <button className="text-sm font-medium border border-gray-200 text-gray-700 py-1.5 px-4 rounded-xl hover:bg-gray-50 transition cursor-pointer bg-white">
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}

                {/* Scenario */}
                {block.type === "scenario" && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Scenario</p>
                      <p className="text-sm text-gray-500">{block.content.scenario}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Choose your approach:</p>
                    <div className="space-y-3">
                      {block.content.choices?.map((choice, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedOptions((p) => ({ ...p, [block.id]: i }))}
                          className={`w-full text-left p-4 rounded-xl border cursor-pointer transition ${
                            selectedOptions[block.id] === i
                              ? "border-primary bg-blue-50/50"
                              : "border-gray-200 hover:bg-gray-50 bg-white"
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-900">{choice.label}</p>
                          {selectedOptions[block.id] === i && (
                            <p className="text-xs text-gray-500 mt-1">{choice.outcome}</p>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-900 block mb-2">
                        Explain your reasoning (optional):
                      </label>
                      <textarea
                        placeholder="Why did you choose this approach?"
                        value={textResponses[block.id] ?? ""}
                        onChange={(e) => setTextResponses((p) => ({ ...p, [block.id]: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-sm resize-none"
                      />
                    </div>
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
                  {currentBlock === MOCK_BLOCKS.length - 1 ? (
                    <button
                      onClick={markComplete}
                      className="flex items-center gap-2 text-sm font-medium bg-gradient-to-b from-gray-700 to-gray-900 text-white py-2 px-5 rounded-xl hover:brightness-110 transition cursor-pointer border-none"
                    >
                      <Send className="w-4 h-4" />
                      Submit Simulation
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
