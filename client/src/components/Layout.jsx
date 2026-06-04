import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Map,
  Hammer,
  BookOpen,
  Award,
  PenSquare,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Briefcase,
  Clock,
  Flame,
  BookMarked,
} from "lucide-react";
import { toggleTheme } from "../store/slices/settingsSlice";
import { recordActivity } from "../store/slices/dashboardSlice";
import { useSearch } from "../hooks/useSearch";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open: openSearch } = useSearch();

  const theme = useSelector((state) => state.settings?.theme || "dark");
  const streak = useSelector((state) => state.dashboard?.streak || 0);
  const completedTopics = useSelector(
    (state) => state.progress?.completedTopics || {},
  );

  // Open sidebar by default on desktop screen sizes on mount
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  // Close sidebar drawer on path change (for mobile and tablet viewports)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Sync HTML class on load
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Record daily learning log activity on mount
  useEffect(() => {
    dispatch(recordActivity());
  }, [dispatch]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Roadmap", path: "/roadmap", icon: Map },
    { name: "Tool Explorer", path: "/tools", icon: Hammer },
    { name: "Notes Manager", path: "/notes", icon: PenSquare },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Interview Hub", path: "/interviews", icon: HelpCircleIcon },
    { name: "Certifications", path: "/certifications", icon: Award },
    { name: "Career Prep", path: "/career", icon: Clock },
    { name: "Resources", path: "/resources", icon: BookOpen },
    { name: "AI Tutor", path: "/ai-assistant", icon: Sparkles },
  ];

  function HelpCircleIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }

  const totalCompleted = Object.values(completedTopics).filter(
    (t) => t.completed,
  ).length;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 font-sans">
      {/* Mobile sidebar overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-25 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 lg:h-full shrink-0`}
      >
        {/* Logo (Fixed top of sidebar) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-md shadow-blue-500/20">
              DC
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              DevOps Compass
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links (Scrolls independently if needed) */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Search trigger button inside sidebar */}
          <button
            onClick={openSearch}
            className="w-full border-b mb-2 border-slate-200 dark:border-slate-800 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all select-none"
          >
            <Search className="w-4 h-4 text-slate-400 " />
            <span>Quick Search</span>
            <kbd className="ml-auto font-sans text-[10px] bg-slate-200 dark:bg-slate-850 px-1.5 py-0.5 rounded text-slate-500 border dark:border-slate-800">
              ⌘K
            </kbd>
          </button>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Fixed bottom of sidebar) */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2 shrink-0">
          {/* Theme Selector */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <span className="flex items-center gap-3">
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
            
          </button>

          {/* Core Info badge */}
          {/* <div className="p-3 bg-blue-50/50 dark:bg-black rounded-lg text-[11px] text-slate-500 dark:text-slate-400 border border-blue-200/20 dark:border-slate-800">
            <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
              MERN Platform Mode
            </p>
            <p>
              Database synchronization is active. Offline local fallback mode is
              enabled.
            </p>
          </div> */}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header (Fixed height, z-index and blur styles preserved) */}
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 glass-nav px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold capitalize select-none hidden md:block">
              {location.pathname === "/"
                ? "Home"
                : location.pathname.substring(1).replace("-", " ")}
            </h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input button trigger */}
            <div
              onClick={openSearch}
              className="relative hidden sm:flex w-64 pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-850/50 cursor-pointer select-none items-center"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <span>Quick Search...</span>
              <kbd className="ml-auto font-sans text-[9px] bg-slate-200 dark:bg-slate-850 px-1 py-0.5 rounded text-slate-500 border dark:border-slate-800">
                ⌘K
              </kbd>
            </div>

            {/* Streak metrics pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs select-none">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>

            {/* Completion stats pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs select-none">
              <BookMarked className="w-4 h-4" />
              <span>{totalCompleted} Completed</span>
            </div>
          </div>
        </header>

        {/* Content Body (Only this area scrolls) */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
