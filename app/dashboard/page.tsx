"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  HelpCircle,
  Moon,
  AreaChart,
  TrendingUp as TrendingUpIcon,
  BarChart3,
  LineChart,
  Search,
  Star,
  Play,
  Clock,
  Eye,
  Sparkles,
  Users,
  MessageSquare,
  Target as TargetIcon,
  Shield,
  Lightbulb,
  AlertCircle as AlertCircleIcon,
  Scale,
  Zap as ZapIcon,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STAB_TASKS } from "@/lib/stab-tasks";

// Mock performance data
const mockMetrics = {
  impressions: 261727,
  clicks: 99160,
  cost: 106884,
  conversions: 6125,
  value: 1597841,
  ctr: 37.9,
  cpa: 17,
  roas: 14.9,
  aov: 261,
  cvr: 6.2,
};

// Mock chart data (90 days)
const generateChartData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cost: 800 + Math.random() * 1200,
      value: 10000 + Math.random() * 30000,
    });
  }
  return data;
};

const chartData = generateChartData();

// AI Prompts for different categories
const AI_PROMPTS = [
  {
    id: 1,
    category: "Bidding",
    title: "Smart Bidding Analysis",
    description: "Comprehensive analysis of campaign readiness for Smart Bidding strategies with target recommendations based on performance data and business goals.",
    dataSource: "Smart Bidding Analysis (Combined)",
    views: 304,
    author: "Aaron Young",
    date: "Today",
    rating: 4.9,
  },
  {
    id: 2,
    category: "Search Terms",
    title: "Negative Keyword Identification",
    description: "Find potential negative keywords based on high-cost, non-converting search queries.",
    dataSource: "Search Terms (80/20)",
    views: 500,
    author: "Mike Rhodes",
    date: "Yesterday",
    rating: 5.0,
  },
  {
    id: 3,
    category: "Search Terms",
    title: "Search Term N-gram Analysis",
    description: "Analyze search term n-gram data to identify user intent patterns, high-converting search patterns, and optimization opportunities.",
    dataSource: "Search Terms N-gram (1-word)",
    views: 342,
    author: "Mike Rhodes",
    date: "Today",
    rating: 4.8,
  },
  {
    id: 4,
    category: "Search Terms",
    title: "Search Term Pattern Analysis",
    description: "Analyze converting search terms to identify common patterns, modifiers, and user intent signals for keyword strategy and ad copy optimization.",
    dataSource: "Converting Search Terms",
    views: 287,
    author: "Mike Rhodes",
    date: "Yesterday",
    rating: 4.9,
  },
  {
    id: 5,
    category: "Keywords",
    title: "Keyword Expansion Opportunities",
    description: "Discover high-converting search terms that aren't currently keywords.",
    dataSource: "Keywords (Last 30d)",
    views: 425,
    author: "Mike Rhodes",
    date: "Today",
    rating: 5.0,
  },
  {
    id: 6,
    category: "Campaigns",
    title: "Campaign Settings Audit",
    description: "Identify inconsistencies or optimization opportunities in campaign settings.",
    dataSource: "Campaign Settings Audit Data (Joined)",
    views: 270,
    author: "Mike Rhodes",
    date: "May 18th, 2025",
    rating: 4.4,
  },
  {
    id: 7,
    category: "PMax",
    title: "PMax Placement Performance",
    description: "Analyze Performance Max placement data to identify low-quality sites and apps.",
    dataSource: "Placement Performance",
    views: 320,
    author: "Mike Rhodes",
    date: "May 16th, 2025",
    rating: 4.6,
  },
  {
    id: 8,
    category: "Campaigns",
    title: "ROAS Maximization Strategy",
    description: "Develops a bidding strategy to maximize Return on Ad Spend (ROAS) based on detailed campaign performance analysis, including optimal spend zones and ROAS at...",
    dataSource: "Campaign Profit Analysis (Processed)",
    views: 0,
    author: "Mike Rhodes",
    date: "Yesterday",
    rating: 4.7,
  },
];

const PROMPT_CATEGORIES = [
  "All Prompts",
  "AI Agents",
  "Search Terms",
  "PMax",
  "Campaigns",
  "Trends",
  "Bidding",
  "Keywords",
  "Shopping",
  "Conversions",
  "Audiences",
  "Devices",
  "Locations",
  "Creative",
];

const METRIC_CATEGORIES = [
  "Overview",
  "Performance",
  "Conversions",
  "Cost Analysis",
  "Keywords",
  "Audiences",
  "Placements",
  "Devices",
  "Locations",
  "Time Analysis",
];

export default function DashboardPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState("Campaign 2");
  const [dateRange, setDateRange] = useState("90 Days");
  const [showAllCombined, setShowAllCombined] = useState(false);
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
  const [movingAverage, setMovingAverage] = useState("30d MA");
  const [selectedPromptCategory, setSelectedPromptCategory] = useState("All Prompts");
  const [selectedCategory, setSelectedCategory] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<typeof AI_PROMPTS[0] | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // AI Response Customization Settings
  const [detailLevel, setDetailLevel] = useState(75); // 0-100, Minimal to Comprehensive
  const [toneFormality, setToneFormality] = useState(33); // 0-100, Professional to Conversational
  const [stakeholderLevel, setStakeholderLevel] = useState(33); // 0-100, Practitioner to Executive
  const [learningIntent, setLearningIntent] = useState("Just Tell Me What To Do");
  const [communicationPerspective, setCommunicationPerspective] = useState("As Your Consultant");
  const [timeHorizon, setTimeHorizon] = useState("Immediate");
  const [actionFocus, setActionFocus] = useState(75); // 0-100, Strategic to Tactical
  const [confidenceAssertiveness, setConfidenceAssertiveness] = useState(75); // 0-100, Tentative to Definitive
  const [storytelling, setStorytelling] = useState(33); // 0-100, Data-only to Narrative-rich
  const [critiqueStyle, setCritiqueStyle] = useState(75); // 0-100, Gentle to Direct
  const [contrarianPerspective, setContrarianPerspective] = useState(50); // 0-100, Supportive to Devil's Advocate
  const [surpriseFactor, setSurpriseFactor] = useState(75); // 0-100, Expected to Mind-blowing
  const [questionPreferences, setQuestionPreferences] = useState({
    followUp: true,
    challengeStrategy: true,
    suggestData: true,
  });

  // Mock task status data
  const taskStatuses: Record<string, { status: "pending" | "in-progress" | "review" | "completed" | "blocked"; progress: number; priority: "low" | "medium" | "high" | "urgent" }> = {
    "campaign-spend-review": { status: "review", progress: 100, priority: "high" },
    "ad-group-spend-review": { status: "in-progress", progress: 65, priority: "medium" },
    "search-term-audit": { status: "pending", progress: 0, priority: "urgent" },
    "keyword-review": { status: "completed", progress: 100, priority: "medium" },
    "call-extensions-review": { status: "pending", progress: 0, priority: "low" },
    "auction-insights": { status: "in-progress", progress: 40, priority: "medium" },
    "keyword-quality-score": { status: "review", progress: 100, priority: "high" },
  };

  // Map prompt titles to API IDs
  const getPromptId = (title: string): string => {
    const mapping: Record<string, string> = {
      "Negative Keyword Identification": "negative-keyword-identification",
      "Search Term N-gram Analysis": "search-term-ngram-analysis",
      "Search Term Pattern Analysis": "search-term-pattern-analysis",
    };
    return mapping[title] || "";
  };

  // Handle prompt execution
  const handleUsePrompt = async (prompt: typeof AI_PROMPTS[0]) => {
    setSelectedPrompt(prompt);
    setAiResponse("");
    setIsLoadingResponse(true);

    const promptId = getPromptId(prompt.title);

    if (!promptId) {
      setAiResponse("This prompt is not yet configured for testing. Only Search Terms prompts are available.");
      setIsLoadingResponse(false);
      return;
    }

    try {
      const response = await fetch("/api/ai/test-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ promptId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      setAiResponse(data.content);
    } catch (error: any) {
      setAiResponse(`Error: ${error.message}\n\nPlease check that your OpenAI API key is configured in .env.local`);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#f8f9fa] text-gray-900 overflow-hidden">
      {/* Left Sidebar - Task List */}
      <div
        className={cn(
          "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          leftSidebarOpen ? "w-80" : "w-0"
        )}
      >
        {leftSidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-lg font-semibold text-gray-900">802Dagent</h1>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setLeftSidebarOpen(false)}
                  className="hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>

              {/* Campaign Selector */}
              <div className="relative">
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
                >
                  <option>Campaign 1</option>
                  <option>Campaign 2</option>
                  <option>Campaign 3</option>
                  <option>All Campaigns</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Prompt Display or Task List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {selectedPrompt ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">AI Response</h2>
                    <button
                      onClick={() => {
                        setSelectedPrompt(null);
                        setAiResponse("");
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  </div>

                  {/* Prompt Title */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Analyzing</div>
                    <div className="text-sm font-semibold text-gray-900">{selectedPrompt.title}</div>
                  </div>

                  {/* AI Response */}
                  {isLoadingResponse ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-3"></div>
                      <p className="text-sm text-gray-500">Analyzing data...</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm text-gray-500">
                      Waiting for response...
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Task List Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-sm font-bold text-gray-900 mb-1">Optimization Tasks</h2>
                    <p className="text-xs text-gray-500">7 tasks • 2 in progress</p>
                  </div>

                  {/* Task Groups */}
                  <div className="p-3">
                    {/* In Progress Tasks */}
                    <div className="mb-5">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        In Progress (2)
                      </h3>
                      <div className="space-y-2">
                        {STAB_TASKS.slice(0, 7)
                          .filter((task) => taskStatuses[task.id]?.status === "in-progress")
                          .map((task) => {
                            const Icon = task.icon;
                            const taskStatus = taskStatuses[task.id];

                            return (
                              <div
                                key={task.id}
                                className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 mb-1">
                                      {task.title}
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded uppercase">
                                        {taskStatus?.priority}
                                      </span>
                                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded">
                                        In Progress
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                      <div
                                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all shadow-sm"
                                        style={{ width: `${taskStatus.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-[11px] text-gray-500 font-medium">
                                      {taskStatus.progress}% complete
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Review Tasks */}
                    <div className="mb-5">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Ready for Review (2)
                      </h3>
                      <div className="space-y-2">
                        {STAB_TASKS.slice(0, 7)
                          .filter((task) => taskStatuses[task.id]?.status === "review")
                          .map((task) => {
                            const Icon = task.icon;
                            const taskStatus = taskStatuses[task.id];

                            return (
                              <div
                                key={task.id}
                                className="group bg-white border-2 border-green-200 rounded-lg p-3 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 mb-1">
                                      {task.title}
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded uppercase">
                                        {taskStatus?.priority}
                                      </span>
                                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        Review
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Completed Tasks */}
                    <div className="mb-5">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Completed (1)
                      </h3>
                      <div className="space-y-2">
                        {STAB_TASKS.slice(0, 7)
                          .filter((task) => taskStatuses[task.id]?.status === "completed")
                          .map((task) => {
                            const Icon = task.icon;
                            const taskStatus = taskStatuses[task.id];

                            return (
                              <div
                                key={task.id}
                                className="group bg-gray-50 border border-gray-200 rounded-lg p-3 opacity-75 hover:opacity-100 transition-all cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gray-300 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-600 mb-1 line-through">
                                      {task.title}
                                    </div>
                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-semibold rounded">
                                      Completed
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Pending Tasks */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        To Do (2)
                      </h3>
                      <div className="space-y-2">
                        {STAB_TASKS.slice(0, 7)
                          .filter((task) => taskStatuses[task.id]?.status === "pending")
                          .map((task) => {
                            const Icon = task.icon;
                            const taskStatus = taskStatuses[task.id];

                            return (
                              <div
                                key={task.id}
                                className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-700 mb-1">
                                      {task.title}
                                    </div>
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-semibold rounded uppercase">
                                      {taskStatus?.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Search and User */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {!leftSidebarOpen && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setLeftSidebarOpen(true)}
                className="hover:bg-gray-100 mr-3"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search campaigns, metrics, or ask the AI..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <Moon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Category Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            {PROMPT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedPromptCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedPromptCategory === category
                    ? "bg-teal-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* AI Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AI_PROMPTS
                .filter(prompt =>
                  selectedPromptCategory === "All Prompts" ||
                  selectedPromptCategory === "AI Agents" ||
                  prompt.category === selectedPromptCategory
                )
                .map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} onUsePrompt={handleUsePrompt} />
                ))}
            </div>

            {AI_PROMPTS.filter(prompt =>
              selectedPromptCategory === "All Prompts" ||
              selectedPromptCategory === "AI Agents" ||
              prompt.category === selectedPromptCategory
            ).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No prompts available in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Response Customization */}
      <div
        className={cn(
          "flex flex-col bg-white border-l border-gray-200 transition-all duration-300 overflow-y-auto",
          rightSidebarOpen ? "w-96" : "w-0"
        )}
      >
        {rightSidebarOpen && (
          <>
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-gray-900">AI Response Customization</h2>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setRightSidebarOpen(false)}
                className="hover:bg-white/50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 p-5 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Detail Level */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <label className="text-sm font-semibold text-gray-900">Detail Level</label>
                </div>
                <p className="text-xs text-gray-600 mb-3">Control depth of explanation and detail</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-orange-200 to-orange-500 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Minimal</span>
                  <span>Comprehensive</span>
                </div>
              </div>

              {/* Tone & Formality */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-semibold text-gray-900">Tone & Formality</label>
                </div>
                <p className="text-xs text-gray-600 mb-3">Adjust between formal business and friendly tone</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toneFormality}
                  onChange={(e) => setToneFormality(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Professional</span>
                  <span>Conversational</span>
                </div>
              </div>

              {/* Stakeholder Level */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-semibold text-gray-900">Stakeholder Level</label>
                </div>
                <p className="text-xs text-gray-600 mb-3">Tailor for managers vs C-suite presentations</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stakeholderLevel}
                  onChange={(e) => setStakeholderLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Practitioner</span>
                  <span>Executive</span>
                </div>
              </div>

              {/* Expert Controls Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-gray-900">Expert Controls</h3>
                  <span className="px-2 py-0.5 bg-indigo-900 text-white text-[10px] font-semibold rounded">Customized</span>
                </div>

                {/* Learning Intent */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-teal-600" />
                    <label className="text-sm font-semibold text-gray-900">Learning Intent</label>
                    <span className="px-1.5 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded">custom</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">What you want to get from this analysis</p>
                  <select
                    value={learningIntent}
                    onChange={(e) => setLearningIntent(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>Just Tell Me What To Do</option>
                    <option>Teach Me Why</option>
                    <option>Help Me Explore Options</option>
                  </select>
                </div>

                {/* Communication Perspective */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <label className="text-sm font-semibold text-gray-900">Communication Perspective</label>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">How to frame the conversation</p>
                  <select
                    value={communicationPerspective}
                    onChange={(e) => setCommunicationPerspective(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>As Your Consultant</option>
                    <option>As Your Teacher</option>
                    <option>As Your Partner</option>
                    <option>As Your Analyst</option>
                  </select>
                </div>

                {/* Time Horizon */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <label className="text-sm font-semibold text-gray-900">Time Horizon</label>
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded">custom</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Focus timeframe for recommendations</p>
                  <select
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option>Immediate</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Quarter</option>
                  </select>
                </div>

                {/* Action Focus */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TargetIcon className="w-4 h-4 text-orange-600" />
                    <label className="text-sm font-semibold text-gray-900">Action Focus</label>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">High-level strategy vs specific actionable steps</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={actionFocus}
                    onChange={(e) => setActionFocus(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-orange-200 to-orange-500 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Strategic</span>
                    <span>Tactical</span>
                  </div>
                </div>

                {/* Confidence & Assertiveness */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <label className="text-sm font-semibold text-gray-900">Confidence & Assertiveness</label>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">How strongly recommendations are presented</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidenceAssertiveness}
                    onChange={(e) => setConfidenceAssertiveness(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-orange-500 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Tentative</span>
                    <span>Definitive</span>
                  </div>
                </div>

                {/* Storytelling & Metaphors */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <label className="text-sm font-semibold text-gray-900">Storytelling & Metaphors</label>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Include stories and narrative elements</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={storytelling}
                    onChange={(e) => setStorytelling(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-500 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Data-only</span>
                    <span>Narrative-rich</span>
                  </div>
                </div>

                {/* Critique Style */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircleIcon className="w-4 h-4 text-red-600" />
                    <label className="text-sm font-semibold text-gray-900">Critique Style</label>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">How directly problems are addressed</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={critiqueStyle}
                    onChange={(e) => setCritiqueStyle(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-teal-200 to-orange-500 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Gentle</span>
                    <span>Direct</span>
                  </div>
                </div>

                {/* Contrarian Perspective */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-yellow-600" />
                    <label className="text-sm font-semibold text-gray-900">Contrarian Perspective</label>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Challenge assumptions vs support approaches</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contrarianPerspective}
                    onChange={(e) => setContrarianPerspective(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-teal-200 to-yellow-500 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Supportive</span>
                    <span>Devil's Advocate</span>
                  </div>
                </div>

                {/* Surprise Factor */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ZapIcon className="w-4 h-4 text-yellow-600" />
                    <label className="text-sm font-semibold text-gray-900">Surprise Factor</label>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Seek unexpected and counter-intuitive insights</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={surpriseFactor}
                    onChange={(e) => setSurpriseFactor(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-gray-200 to-yellow-500 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Expected</span>
                    <span>Mind-blowing</span>
                  </div>
                </div>

                {/* Question Style Preferences */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <label className="text-sm font-semibold text-gray-900">Question Style Preferences</label>
                    <span className="px-1.5 py-0.5 bg-teal-900 text-white text-[10px] font-semibold rounded">3 selected</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">What types of questions to include in responses</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-teal-50 border border-teal-200 cursor-pointer hover:bg-teal-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={questionPreferences.followUp}
                        onChange={(e) => setQuestionPreferences({ ...questionPreferences, followUp: e.target.checked })}
                        className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Follow-up Questions</div>
                        <div className="text-xs text-gray-600">End with relevant next questions</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-teal-50 border border-teal-200 cursor-pointer hover:bg-teal-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={questionPreferences.challengeStrategy}
                        onChange={(e) => setQuestionPreferences({ ...questionPreferences, challengeStrategy: e.target.checked })}
                        className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Challenge My Strategy</div>
                        <div className="text-xs text-gray-600">Question current approaches</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-teal-50 border border-teal-200 cursor-pointer hover:bg-teal-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={questionPreferences.suggestData}
                        onChange={(e) => setQuestionPreferences({ ...questionPreferences, suggestData: e.target.checked })}
                        className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Suggest Additional Data</div>
                        <div className="text-xs text-gray-600">Recommend what to analyze next</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Save Customizations
              </Button>
              <Button
                variant="ghost"
                className="w-full hover:bg-gray-100 text-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar Toggle Button */}
      {!rightSidebarOpen && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setRightSidebarOpen(true)}
          className="absolute right-4 top-4 hover:bg-white/80 bg-white shadow-md border border-gray-200"
        >
          <Settings className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "teal" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 border",
        variant === "teal" && "bg-teal-500 text-white border-teal-600",
        variant === "dark" && "bg-[#1a2332] text-white border-[#2a3442]",
        variant === "default" && "bg-white border-gray-200"
      )}
    >
      <div
        className={cn(
          "text-xs mb-1",
          variant === "teal" || variant === "dark" ? "text-white/80" : "text-gray-600"
        )}
      >
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

// Prompt Card Component
function PromptCard({
  prompt,
  onUsePrompt
}: {
  prompt: typeof AI_PROMPTS[0];
  onUsePrompt: (prompt: typeof AI_PROMPTS[0]) => void;
}) {
  const categoryColors: Record<string, string> = {
    Bidding: "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Search Terms": "bg-orange-50 text-orange-700 border-orange-200",
    Keywords: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Campaigns: "bg-blue-50 text-blue-700 border-blue-200",
    PMax: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-teal-300 transition-all duration-200 hover:shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <span
            className={cn(
              "px-3 py-1 rounded-md text-xs font-semibold border",
              categoryColors[prompt.category] || "bg-gray-50 text-gray-700 border-gray-200"
            )}
          >
            {prompt.category}
          </span>
          <div className="flex items-center gap-1 text-orange-400">
            <Star className="w-4 h-4 fill-orange-400" />
            <span className="text-sm font-semibold text-gray-900">{prompt.rating}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{prompt.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{prompt.description}</p>

        <div className="text-xs text-gray-500 mb-4">
          Data Source: {prompt.dataSource}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{prompt.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{prompt.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{prompt.date}</span>
          </div>
        </div>
      </div>

      {/* Use Prompt Button */}
      <button
        onClick={() => onUsePrompt(prompt)}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3.5 px-6 flex items-center justify-center gap-2 font-semibold transition-colors"
      >
        <Play className="w-4 h-4 fill-white" />
        Use Prompt
      </button>
    </div>
  );
}
