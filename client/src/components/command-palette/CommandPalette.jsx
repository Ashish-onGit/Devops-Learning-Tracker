import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  Search,
  BookOpen,
  PenSquare,
  HelpCircle,
  Briefcase,
  Hammer,
  Award,
  BookMarked,
  Rss,
  Clock,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";
import { seedData } from "../../utils/seedData";

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const notes = useSelector((state) => state.notes?.notes || []);
  const completedTopics = useSelector(
    (state) => state.progress?.completedTopics || {},
  );
  const bookmarks = useSelector((state) => state.bookmarks?.topics || []);

  // Component search state
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [recentQueries, setRecentQueries] = useState([]);

  // Load recent searches from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recent_searches");
      if (saved) setRecentQueries(JSON.parse(saved));
    } catch (e) {}
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFocusedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Compile Search Index Items
  const searchItems = useMemo(() => {
    const items = [];

    // 1. Learning Topics
    seedData.topics.forEach((t) => {
      items.push({
        id: t.id,
        title: t.title,
        desc: t.summary,
        category: "Learning Topics",
        icon: BookOpen,
        path: `/topics/${t.id}`,
      });
    });

    // 2. Custom Notes
    notes.forEach((n) => {
      items.push({
        id: n.id,
        title: n.title,
        desc: n.content.replace(/[#*`]/g, ""),
        category: "Notes",
        icon: PenSquare,
        path: "/notes",
      });
    });

    // 3. Tools
    seedData.tools.forEach((tl) => {
      items.push({
        id: tl.toolName,
        title: tl.toolName,
        desc: tl.overview,
        category: "Tools",
        icon: Hammer,
        path: `/tools?tool=${encodeURIComponent(tl.toolName)}`,
      });
    });

    // 4. Projects
    seedData.projects.forEach((p) => {
      items.push({
        id: p.title,
        title: p.title,
        desc: p.goal,
        category: "Projects",
        icon: Briefcase,
        path: "/projects",
      });
    });

    // 5. Interviews
    seedData.interviewQuestions.forEach((i) => {
      items.push({
        id: i.question,
        title: i.question,
        desc: i.answer,
        category: "Interview Questions",
        icon: HelpCircle,
        path: `/interviews?category=${encodeURIComponent(i.category)}`,
      });
    });

    // 6. Certifications
    seedData.certifications.forEach((c) => {
      items.push({
        id: c.code,
        title: c.name,
        desc: `${c.provider} Certification path (${c.code})`,
        category: "Certifications",
        icon: Award,
        path: "/certifications",
      });
    });

    return items;
  }, [notes]);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(searchItems, {
      keys: ["title", "desc", "category"],
      threshold: 0.4,
    });
  }, [searchItems]);

  // Compute results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const searchRes = fuse.search(query);
    return searchRes.map((r) => r.item);
  }, [query, fuse]);

  // Record Search Query in LocalStorage
  const recordSearchQuery = (q) => {
    if (!q.trim()) return;
    const cleanQuery = q.trim();
    const updated = [
      cleanQuery,
      ...recentQueries.filter((item) => item !== cleanQuery),
    ].slice(0, 10);
    setRecentQueries(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const handleSelectItem = (item) => {
    if (query.trim()) {
      recordSearchQuery(query);
    }
    navigate(item.path);
    onClose();
  };

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const itemsLength = query.trim() ? results.length : suggestedItems.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % itemsLength);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + itemsLength) % itemsLength);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = query.trim()
          ? results[focusedIndex]
          : suggestedItems[focusedIndex];
        if (selected) {
          handleSelectItem(selected);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, query, results, focusedIndex]);

  // Compute Suggested Items (Empty State)
  const suggestedItems = useMemo(() => {
    const items = [];

    // Continue Learning
    const incomplete = seedData.topics.find(
      (t) => !completedTopics[t.id]?.completed,
    );
    if (incomplete) {
      items.push({
        title: `Resume: ${incomplete.title}`,
        desc: incomplete.summary,
        category: "Continue Learning",
        icon: Clock,
        path: `/topics/${incomplete.id}`,
      });
    }

    // Suggested foundation
    const linux = seedData.topics.find((t) => t.id === "linux-commands");
    if (linux) {
      items.push({
        title: linux.title,
        desc: "Start learning with Linux shell essentials.",
        category: "Suggested Topics",
        icon: BookMarked,
        path: `/topics/linux-commands`,
      });
    }

    // Recent Notes
    if (notes.length > 0) {
      const lastNote = notes[notes.length - 1];
      items.push({
        title: lastNote.title,
        desc: "Edit or view your recently saved notes.",
        category: "Recent Notes",
        icon: FileText,
        path: `/notes`,
      });
    }

    // AI Assistant
    items.push({
      title: "AI Learning Tutor",
      desc: "Ask our system questions about docker networking, SSH, or state files.",
      category: "Assistant",
      icon: SparklesIcon,
      path: "/ai-assistant",
    });

    return items;
  }, [completedTopics, notes]);

  function SparklesIcon(props) {
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
        <path d="m12 3-1.912 5.886a1 1 0 0 1-.95.69H2.946l4.975 3.615a1 1 0 0 1 .364 1.118L6.373 21l4.976-3.615a1 1 0 0 1 1.164 0L17.49 21l-1.913-5.691a1 1 0 0 1 .364-1.118l4.975-3.615h-6.192a1 1 0 0 1-.95-.69L12 3Z" />
      </svg>
    );
  }

  const itemsToShow = query.trim() ? results : suggestedItems;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm command-palette-backdrop"
        >
          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            className="w-full max-w-xl rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-black shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[450px] command-palette-modal"
          >
            {/* Search Input bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/20 dark:bg-slate-950/20">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search anything... (e.g. Docker, Terraform, S3)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                className="w-full bg-transparent text-sm border-none focus:outline-none focus:ring-0 placeholder-slate-450 text-slate-800 dark:text-slate-100"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Results / Empty View */}
            <div className="flex-1 overflow-y-auto p-2">
              {itemsToShow.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No matching results found for "{query}".
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Title labels for sections if not searching */}
                  {!query.trim() && (
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-455 uppercase select-none">
                      Dashboard Quick Actions & Suggestions
                    </div>
                  )}

                  {/* Items loop */}
                  {itemsToShow.map((item, index) => {
                    const isFocused = index === focusedIndex;
                    const ItemIcon = item.icon;

                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 text-left ${
                          isFocused
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500/20"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isFocused
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 dark:bg-slate-950 text-slate-450 border dark:border-slate-800"
                            }`}
                          >
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`text-xs font-bold truncate ${isFocused ? "text-white" : "text-slate-800 dark:text-slate-200"}`}
                            >
                              {item.title}
                            </h4>
                            <p
                              className={`text-[10px] truncate max-w-[400px] mt-0.5 ${isFocused ? "text-blue-100" : "text-slate-450 dark:text-slate-500"}`}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        {/* Action details */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                              isFocused
                                ? "bg-white/25 text-white"
                                : "bg-slate-100 dark:bg-slate-850 text-slate-500 border dark:border-slate-800"
                            }`}
                          >
                            {item.category}
                          </span>
                          {isFocused && (
                            <ArrowRight className="w-3.5 h-3.5 text-white animate-pulse" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Keymap Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050505] flex justify-between text-[9px] text-slate-400 select-none">
              <div className="flex gap-3">
                <span>↑↓ Navigate</span>
                <span>Enter Open</span>
                <span>Esc Dismiss</span>
              </div>
              <div>
                <span>DevOps Compass Palette</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
