import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Award,
  BookOpen,
  Flame,
  Clock,
  BookMarked,
  Search,
  ArrowRight,
  TrendingUp,
  Terminal,
  HelpCircle,
  Briefcase,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { api } from "../../utils/api";
import { incrementTimeSpent } from "../../store/slices/dashboardSlice";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchQuery = searchParams.get("search") || "";

  // Redux state
  const completedTopics = useSelector(
    (state) => state.progress?.completedTopics || {},
  );
  const streak = useSelector((state) => state.dashboard?.streak || 0);
  const timeSpent = useSelector((state) => state.dashboard?.timeSpent || 0);
  const weeklyActivity = useSelector(
    (state) => state.dashboard?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0],
  );
  const bookmarkedIds = useSelector((state) => state.bookmarks?.topics || []);

  // Component state
  const [topics, setTopics] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Simulate learning time tracker: increment time spent by 1 minute every 60 seconds when on dashboard
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(incrementTimeSpent(1));
    }, 60000);
    return () => clearInterval(timer);
  }, [dispatch]);

  // Load all topics outline
  useEffect(() => {
    const fetchTopics = async () => {
      const data = await api.getTopics();
      setTopics(data);
    };
    fetchTopics();
  }, []);

  // Perform search when query changes
  useEffect(() => {
    const runSearch = async () => {
      if (searchQuery.trim()) {
        setSearchLoading(true);
        const results = await api.searchGlobal(searchQuery);
        setSearchResults(results);
        setSearchLoading(false);
      } else {
        setSearchResults(null);
      }
    };
    runSearch();
  }, [searchQuery]);

  // Calculations for stats
  const totalTopics = topics.length || 21; // fallback if api pending
  const completedCount = Object.values(completedTopics).filter(
    (t) => t.completed,
  ).length;
  const percentComplete =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Recharts Chart 1: Category Completion
  const categories = [
    "Foundation",
    "Containers",
    "Orchestration",
    "CI/CD",
    "IaC",
    "Cloud",
    "Monitoring",
    "Security",
    "GitOps",
    "Service Mesh",
    "Advanced",
  ];
  const categoryData = categories
    .map((cat) => {
      const catTopics = topics.filter(
        (t) =>
          t.category === cat ||
          (cat === "Service Mesh" && t.category === "ServiceMesh"),
      );
      const totalInCat = catTopics.length;
      const completedInCat = catTopics.filter(
        (t) => completedTopics[t.id]?.completed,
      ).length;
      return {
        name: cat,
        completed: completedInCat,
        total: totalInCat || 1, // prevent divide by zero
        percentage:
          totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0,
      };
    })
    .filter((c) => c.total > 0);

  // Recharts Chart 2: Weekly Activity
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activityData = days.map((day, idx) => ({
    day,
    actions: weeklyActivity[idx] || 0,
  }));

  // Recharts Chart 3: Progress Area
  const progressData = [
    {
      name: "Week 1",
      completed: Math.min(completedCount, Math.round(completedCount * 0.2)),
    },
    {
      name: "Week 2",
      completed: Math.min(completedCount, Math.round(completedCount * 0.5)),
    },
    {
      name: "Week 3",
      completed: Math.min(completedCount, Math.round(completedCount * 0.8)),
    },
    { name: "Current", completed: completedCount },
  ];

  // Bookmarks filter
  const bookmarkedTopics = topics.filter((t) => bookmarkedIds.includes(t.id));

  // Category Color Palette
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#6366f1",
    "#ec4899",
    "#8b5cf6",
    "#14b8a6",
    "#f43f5e",
  ];

  return (
    <div className="space-y-6">
      {/* Search Header Output (if searching) */}
      {searchQuery && (
        <div className="p-4 rounded-xl glass-card border border-blue-500/20 bg-blue-500/5 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Search className="w-4 h-4" /> Global Search Results for "
              {searchQuery}"
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
            >
              Clear Search <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {searchLoading ? (
            <p className="text-xs text-slate-500 mt-2 animate-pulse">
              Running fuzzy search...
            </p>
          ) : searchResults ? (
            <div className="mt-4 space-y-4">
              {/* Topics Matches */}
              {searchResults.topics?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-2">
                    Roadmap Topics ({searchResults.topics.length})
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {searchResults.topics.map((t) => (
                      <Link
                        key={t.id}
                        to={`/topics/${t.id}`}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-black hover:border-blue-500 dark:hover:border-blue-400 flex items-center justify-between text-xs font-semibold"
                      >
                        <span>{t.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools Matches */}
              {searchResults.tools?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-2">
                    Tool Guides ({searchResults.tools.length})
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {searchResults.tools.map((t) => (
                      <Link
                        key={t.toolName}
                        to={`/tools?tool=${encodeURIComponent(t.toolName)}`}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-black hover:border-blue-500 dark:hover:border-blue-400 flex items-center justify-between text-xs font-semibold"
                      >
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-slate-400" />{" "}
                          {t.toolName}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Matches */}
              {searchResults.projects?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-2">
                    Projects ({searchResults.projects.length})
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {searchResults.projects.map((p) => (
                      <Link
                        key={p.title}
                        to={`/projects`}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-black hover:border-blue-500 dark:hover:border-blue-400 flex items-center justify-between text-xs font-semibold"
                      >
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />{" "}
                          {p.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Matches */}
              {searchResults.interviews?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-2">
                    Interview Qs ({searchResults.interviews.length})
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {searchResults.interviews.map((i) => (
                      <Link
                        key={i.question}
                        to={`/interviews?category=${encodeURIComponent(i.category)}`}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-black hover:border-blue-500 dark:hover:border-blue-400 flex items-center justify-between text-xs font-semibold"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />{" "}
                          {i.question}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {Object.values(searchResults).every(
                (arr) => arr.length === 0,
              ) && (
                <p className="text-xs text-slate-500 mt-2">
                  No matching topics, tools, projects, or questions found. Try
                  fuzzy terms like "Linux", "Docker", or "VPC".
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Progress */}
        <div className="p-5 rounded-xl glass-card flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Total Progress
            </p>
            <h3 className="text-xl font-bold">{percentComplete}%</h3>
            <p className="text-[10px] text-slate-400">
              {completedCount} of {totalTopics} topics finished
            </p>
          </div>
        </div>

        {/* Card 2: Streak */}
        <div className="p-5 rounded-xl glass-card flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Streak Count
            </p>
            <h3 className="text-xl font-bold">{streak} Days</h3>
            <p className="text-[10px] text-slate-400">
              Keep active to build momentum
            </p>
          </div>
        </div>

        {/* Card 3: Time Spent */}
        <div className="p-5 rounded-xl glass-card flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Study Duration
            </p>
            <h3 className="text-xl font-bold">{timeSpent} Mins</h3>
            <p className="text-[10px] text-slate-400">
              Increments while studying pages
            </p>
          </div>
        </div>

        {/* Card 4: Bookmarks */}
        <div className="p-5 rounded-xl glass-card flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Saved Items
            </p>
            <h3 className="text-xl font-bold">
              {bookmarkedTopics.length} Topics
            </h3>
            <p className="text-[10px] text-slate-400">
              Pinned items in Roadmap
            </p>
          </div>
        </div>
      </div>

      {/* Chart Layout Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Progress Area & Weekly Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Chart */}
          <div className="p-5 rounded-xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Learning Curve
                Progress
              </h3>
              <span className="text-[10px] bg-slate-100 dark:bg-black px-2 py-0.5 rounded text-slate-500">
                Cumulative
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient
                      id="colorProgress"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-800"
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "8px",
                      border: "1px solid #202020",
                      background: "#0A0A0A",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProgress)"
                    name="Completed Topics"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Activity Bar Chart */}
          <div className="p-5 rounded-xl glass-card space-y-4">
            <h3 className="text-sm font-bold">Weekly Activity Logs</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis
                    dataKey="day"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-800"
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "8px",
                      border: "1px solid #202020",
                      background: "#0A0A0A",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="actions"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    name="API Interactions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Pie Chart Category completions & Bookmarks */}
        <div className="space-y-6">
          {/* Category Pie Chart */}
          <div className="p-5 rounded-xl glass-card space-y-4">
            <h3 className="text-sm font-bold">Roadmap Category Ratios</h3>
            <div className="h-60 flex items-center justify-center relative">
              {categoryData.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Complete topics to view category ratios.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="completed"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        fontSize: "10px",
                        background: "#0A0A0A",
                        border: "1px solid #202020",
                        borderRadius: "4px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Legends inside center or below */}
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto pt-2 border-t border-slate-100 dark:border-slate-800">
              {categoryData.map((c, idx) => (
                <div
                  key={c.name}
                  className="flex items-center gap-1.5 text-[10px]"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="truncate">
                    {c.name}: {c.completed}/{c.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarks widget */}
          <div className="p-5 rounded-xl glass-card space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-emerald-500" /> Bookmarked
              Topics
            </h3>
            {bookmarkedTopics.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-slate-500">No bookmarked topics.</p>
                <Link
                  to="/roadmap"
                  className="inline-block text-[11px] text-blue-500 hover:underline"
                >
                  Visit Roadmap to bookmark topics
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {bookmarkedTopics.map((t) => (
                  <Link
                    key={t.id}
                    to={`/topics/${t.id}`}
                    className="p-2.5 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white/50 dark:bg-[#0A0A0A] hover:bg-slate-100 dark:hover:bg-[#151515] transition flex items-center justify-between text-xs font-semibold"
                  >
                    <span className="truncate">{t.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
