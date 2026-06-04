import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Star,
  CheckCircle,
  BookOpen,
  Terminal,
  HelpCircle,
  Clipboard,
  Check,
  Play,
  Edit3,
  Plus,
  Trash2,
  Sparkles,
  BookMarked,
  Save,
  ChevronDown,
  Lock,
} from "lucide-react";
import { api } from "../../utils/api";
import { toggleBookmark } from "../../store/slices/bookmarksSlice";
import {
  completeTopic,
  updateQuizScore,
} from "../../store/slices/progressSlice";
import { addNote } from "../../store/slices/notesSlice";
import { useToast } from "../../hooks/useToast";
import ReactMarkdown from "react-markdown";

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  // Redux state
  const completedTopics = useSelector(
    (state) => state.progress?.completedTopics || {},
  );
  const bookmarkedIds = useSelector((state) => state.bookmarks?.topics || []);

  // Component state
  const [topic, setTopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("theory"); // theory, commands, labs, quiz
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [learningPathCollapsed, setLearningPathCollapsed] = useState(false);
  const [notesCollapsed, setNotesCollapsed] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Notes widget state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");

  useEffect(() => {
    const fetchTopicAndAll = async () => {
      setLoading(true);
      try {
        const [data, topicsData] = await Promise.all([
          api.getTopicById(id),
          api.getTopics(),
        ]);
        setTopic(data);
        setAllTopics(topicsData || []);
        // Reset quiz
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setQuizScore(0);
        setNoteTitle(`My notes on ${data?.title || "topic"}`);
        setNoteContent("");
        setNoteTags("");
      } catch (error) {
        console.error("Failed to load topic details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicAndAll();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12 space-y-4">
        <h3 className="text-lg font-bold">Topic not found</h3>
        <Link
          to="/roadmap"
          className="text-blue-500 hover:underline flex items-center gap-1 justify-center"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roadmap
        </Link>
      </div>
    );
  }

  const isCompleted = completedTopics[topic.id]?.completed;
  const isBookmarked = bookmarkedIds.includes(topic.id);

  const handleBookmarkToggle = () => {
    dispatch(toggleBookmark({ type: "topics", id: topic.id }));
    if (isBookmarked) {
      toast.info("Removed from bookmarks");
    } else {
      toast.success("Added to bookmarks");
    }
  };

  const handleMarkComplete = () => {
    dispatch(
      completeTopic({
        topicId: topic.id,
        quizPassed: completedTopics[topic.id]?.quizPassed || false,
        score: completedTopics[topic.id]?.score || 0,
      }),
    );
    toast.success("Topic marked completed!");
  };

  // Copy command helper
  const handleCopyCommand = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Command copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Quiz helper
  const handleAnswerSelect = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted || !topic.quiz?.questions) return;

    let correctCount = 0;
    const questions = topic.quiz.questions;

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercent >= 70; // 70% passing grade

    setQuizScore(scorePercent);
    setQuizSubmitted(true);

    // Save score in Redux
    dispatch(
      updateQuizScore({
        topicId: topic.id,
        quizPassed: passed,
        score: scorePercent,
      }),
    );

    // Auto complete topic if quiz passed
    if (passed) {
      dispatch(
        completeTopic({
          topicId: topic.id,
          quizPassed: true,
          score: scorePercent,
        }),
      );
      toast.success(
        `Assessment passed with ${scorePercent}%! Topic completed.`,
      );
    } else {
      toast.error(
        `Assessment failed with ${scorePercent}%. 70% required to pass.`,
      );
    }
  };

  // Notes widget helper
  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    dispatch(
      addNote({
        topicId: topic.id,
        title: noteTitle || `Notes on ${topic.title}`,
        content: noteContent,
        category: "Learning Notes",
        tags: noteTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    );

    toast.success("Note saved successfully");
    setNoteContent("");
    setNoteTags("");
  };
  const currentCategory = topic?.category || "";
  const siblingTopics = allTopics.filter((t) => t.category === currentCategory);
  const totalSiblings = siblingTopics.length;
  const completedSiblings = siblingTopics.filter(
    (t) => completedTopics[t.id]?.completed
  ).length;
  const progressPercentage =
    totalSiblings > 0 ? Math.round((completedSiblings / totalSiblings) * 100) : 0;

  const currentIndex = siblingTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? siblingTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex !== -1 && currentIndex < siblingTopics.length - 1
      ? siblingTopics[currentIndex + 1]
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Lesson Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Back Link & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link
            to="/roadmap"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Roadmap
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to={`/ai-assistant?context=${topic.id}`}
              className="px-4 py-2 rounded-lg border border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4" /> Ask AI Tutor
            </Link>
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-lg border transition ${
                isBookmarked
                  ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5"
                  : "border-slate-200 dark:border-slate-800 text-slate-400"
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleMarkComplete}
              disabled={isCompleted}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/10"
              }`}
            >
              <CheckCircle className="w-4 h-4" />{" "}
              {isCompleted ? "Topic Completed" : "Mark Completed"}
            </button>
          </div>
        </div>

        {/* Sibling Path Chips */}
        {siblingTopics.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar border-b border-[#202020]">
            {siblingTopics.map((sibling) => {
              const isCurrent = sibling.id === topic.id;
              const isCompletedSibling = completedTopics[sibling.id]?.completed;
              return (
                <Link
                  key={sibling.id}
                  to={`/topics/${sibling.id}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                    isCurrent
                      ? "bg-[#1A1A1A] border-blue-500 text-blue-400"
                      : "bg-[#0A0A0A] border-[#202020] text-slate-400 hover:bg-[#151515] hover:text-slate-200"
                  }`}
                >
                  {isCompletedSibling && <Check className="w-3 h-3 text-emerald-500" />}
                  {sibling.title}
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile Drawer Navigation (lg:hidden) */}
        {siblingTopics.length > 0 && (
          <div className="lg:hidden w-full">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-[#202020] bg-[#0A0A0A] text-xs font-bold text-slate-300 transition hover:bg-[#151515]"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Path Navigation ({completedSiblings} / {totalSiblings} Completed)</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileDrawerOpen ? "rotate-180" : ""}`} />
            </button>
            
            {mobileDrawerOpen && (
              <div className="mt-2 p-4 rounded-lg border border-[#202020] bg-[#050505] space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{currentCategory}</h4>
                <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="space-y-1 pt-2">
                  {siblingTopics.map((sibling, index) => {
                    const isCurrent = sibling.id === topic.id;
                    const isCompletedSibling = completedTopics[sibling.id]?.completed;
                    const isLocked = index > 0 && !completedTopics[siblingTopics[index - 1].id]?.completed && !isCompletedSibling && !isCurrent;
                    
                    return (
                      <Link
                        key={sibling.id}
                        to={isLocked ? "#" : `/topics/${sibling.id}`}
                        onClick={(e) => {
                          if (isLocked) {
                            e.preventDefault();
                            toast.info(`Please complete "${siblingTopics[index - 1].title}" first!`);
                          } else {
                            setMobileDrawerOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition ${
                          isCurrent
                            ? "bg-[#1A1A1A] text-blue-400"
                            : isLocked
                            ? "opacity-40 cursor-not-allowed text-slate-500"
                            : "text-slate-400 hover:bg-[#151515] hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isCompletedSibling ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          ) : isCurrent ? (
                            <span className="w-3.5 h-3.5 rounded-full border border-blue-500 flex items-center justify-center flex-shrink-0">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                          )}
                          <span className="truncate">{sibling.title}</span>
                        </div>
                        {isLocked && <Lock className="w-3.5 h-3.5 text-slate-650" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Heading Card */}
        <div className="p-6 rounded-xl glass-card space-y-2">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
            {topic.category}
          </span>
          <h2 className="text-2xl font-black">{topic.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {topic.summary}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "theory"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Theory & Overview
          </button>
          <button
            onClick={() => setActiveTab("commands")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "commands"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Commands Syntax
          </button>
          <button
            onClick={() => setActiveTab("labs")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "labs"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Hands-on Labs
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === "quiz"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Quiz Assessment
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[300px]">
          {/* 1. Theory tab */}
          {activeTab === "theory" && topic.content && (
            <div className="space-y-6">
              {/* Theory text */}
              <div className="p-6 rounded-xl glass-card prose dark:prose-invert max-w-none space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest border-b border-slate-200/50 dark:border-[#202020] pb-2">
                  Core Theory
                </h3>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {topic.content.theory}
                </p>
              </div>

              {/* Visual Explanation */}
              {topic.content.visualExplanation && (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#111111] border border-slate-200/50 dark:border-[#202020] text-slate-600 dark:text-slate-300 font-mono text-xs space-y-3">
                  <h3 className="text-sm font-extrabold text-blue-400 uppercase tracking-widest border-b border-slate-200/50 dark:border-[#202020] pb-2">
                    Architecture Workflow
                  </h3>
                  <div className="overflow-x-auto whitespace-pre p-2">
                    {topic.content.visualExplanation}
                  </div>
                </div>
              )}

              {/* Real World Example */}
              {topic.content.realWorldExample && (
                <div className="p-6 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/20 text-slate-600 dark:text-slate-400 text-xs space-y-2">
                  <h3 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Real World Scenario
                  </h3>
                  <p className="leading-relaxed">
                    {topic.content.realWorldExample}
                  </p>
                </div>
              )}

              {/* Best practices & common mistakes */}
              <div className="grid md:grid-cols-2 gap-4">
                {topic.content.bestPractices?.length > 0 && (
                  <div className="p-5 rounded-xl glass-card">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      Best Practices
                    </h4>
                    <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {topic.content.bestPractices.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {topic.content.commonMistakes?.length > 0 && (
                  <div className="p-5 rounded-xl glass-card">
                    <h4 className="text-xs font-bold text-red-500 mb-2">
                      Common Mistakes
                    </h4>
                    <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {topic.content.commonMistakes.map((cm, i) => (
                        <li key={i}>{cm}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Commands tab */}
          {activeTab === "commands" && topic.content && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold">Terminal Reference Sheets</h3>
              {topic.content.commands?.length > 0 ? (
                <div className="space-y-2">
                  {topic.content.commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-slate-50 dark:bg-[#111111] border border-slate-200/50 dark:border-[#202020] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs text-slate-600 dark:text-slate-300"
                    >
                      <div className="space-y-1">
                        <span className="text-blue-400 font-bold">
                          $ {cmd.command}
                        </span>
                        <p className="text-[10px] text-slate-500 font-sans">
                          {cmd.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyCommand(cmd.command, idx)}
                        className="p-2 rounded bg-slate-250 hover:bg-slate-300 dark:bg-[#1A1A1A] dark:hover:bg-[#252525] text-slate-600 dark:text-slate-400 flex items-center justify-center self-end md:self-auto border border-slate-300 dark:border-[#333333]"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Clipboard className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No commands loaded for this specific topic.
                </p>
              )}
            </div>
          )}

          {/* 3. Labs / Mini Projects */}
          {activeTab === "labs" && topic.content && (
            <div className="space-y-6">
              {/* Labs */}
              {topic.content.labs?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">
                    Step-by-step Hands-on Labs
                  </h3>
                  {topic.content.labs.map((lab, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl glass-card space-y-3"
                    >
                      <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-blue-500 fill-current" />{" "}
                        Lab {idx + 1}: {lab.title}
                      </h4>
                      <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                        {lab.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}

              {/* Mini Project */}
              {topic.content.miniProject && (
                <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/[0.01] space-y-3">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Challenge Mini-Project:{" "}
                    {topic.content.miniProject.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {topic.content.miniProject.description}
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    {topic.content.miniProject.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>

                  {/* Solution display */}
                  <details className="mt-4 group border border-slate-200/50 dark:border-[#202020] rounded-lg bg-white dark:bg-[#0A0A0A] overflow-hidden text-xs">
                    <summary className="p-3 font-bold cursor-pointer select-none text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#151515] flex items-center justify-between">
                      <span>View Solution Blueprint</span>
                      <ChevronDown className="w-4 h-4 transform group-open:rotate-180 transition" />
                    </summary>
                    <div className="p-4 border-t border-slate-200/50 dark:border-[#202020] bg-slate-900 dark:bg-[#111111] text-slate-300 font-mono overflow-x-auto whitespace-pre p-3">
                      {topic.content.miniProject.solution}
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}

          {/* 4. Quiz Assessment */}
          {activeTab === "quiz" && (
            <div className="space-y-6">
              {topic.quiz?.questions?.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-500" /> Topic
                      Quiz Assessment
                    </h3>
                    {quizSubmitted && (
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          quizScore >= 70
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                            : "bg-red-500/10 text-red-650"
                        }`}
                      >
                        Score: {quizScore}%{" "}
                        {quizScore >= 70 ? "(Passed)" : "(Failed - Need 70%)"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {topic.quiz.questions.map((q, qIdx) => {
                      const isCorrect =
                        selectedAnswers[qIdx] === q.correctIndex;
                      const hasSelected = selectedAnswers[qIdx] !== undefined;

                      return (
                        <div
                          key={qIdx}
                          className="p-5 rounded-xl glass-card space-y-3"
                        >
                          <p className="font-bold text-xs text-slate-700 dark:text-slate-300">
                            {qIdx + 1}. {q.questionText}
                          </p>
                          <div className="grid gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isOptionSelected =
                                selectedAnswers[qIdx] === optIdx;
                              let optStyles =
                                "border-slate-200 dark:border-[#202020] hover:bg-slate-50 dark:hover:bg-[#151515] bg-white dark:bg-[#0A0A0A]";

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  optStyles =
                                    "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450";
                                } else if (isOptionSelected) {
                                  optStyles =
                                    "border-red-500 bg-red-500/10 text-red-600 dark:text-red-455";
                                } else {
                                  optStyles =
                                    "border-slate-200 dark:border-[#202020] opacity-60 bg-white dark:bg-[#0A0A0A]";
                                }
                              } else if (isOptionSelected) {
                                optStyles =
                                  "border-blue-605 bg-blue-500/5 text-blue-600 dark:text-blue-400";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() =>
                                    handleAnswerSelect(qIdx, optIdx)
                                  }
                                  disabled={quizSubmitted}
                                  className={`p-3 rounded-lg border text-left text-xs font-semibold transition ${optStyles}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {quizSubmitted && q.explanation && (
                            <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-[#111111]/30 p-2.5 rounded border border-slate-200/50 dark:border-[#202020]">
                              <b>Explanation:</b> {q.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={
                        Object.keys(selectedAnswers).length <
                        topic.quiz.questions.length
                      }
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-55 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition"
                    >
                      Submit Assessment Answers
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="w-full py-2.5 border border-slate-350 dark:border-slate-700 font-bold text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Retake Quiz Assessment
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-550">
                  No quiz loaded for this specific topic.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recommended Next Topic */}
        {isCompleted && nextTopic && (
          <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Topic Completed! Ready for the next step?</span>
              </div>
              <h4 className="text-sm font-black text-slate-200">
                Up Next: {nextTopic.title}
              </h4>
              <p className="text-[11px] text-slate-400">
                {nextTopic.summary}
              </p>
            </div>
            <Link
              to={`/topics/${nextTopic.id}`}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-lg transition shadow-lg shadow-emerald-500/10 whitespace-nowrap text-center"
            >
              Continue Learning
            </Link>
          </div>
        )}

        {/* Sequential Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#202020]">
          {prevTopic ? (
            <Link
              to={`/topics/${prevTopic.id}`}
              className="flex-1 flex items-center gap-3 p-4 rounded-xl border border-[#202020] bg-[#0A0A0A] text-left hover:bg-[#151515] transition group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Previous Topic</span>
                <span className="text-xs font-bold text-slate-300">{prevTopic.title}</span>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextTopic ? (
            <Link
              to={`/topics/${nextTopic.id}`}
              className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl border border-[#202020] bg-[#0A0A0A] text-right hover:bg-[#151515] transition group"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Next Topic</span>
                <span className="text-xs font-bold text-slate-300">{nextTopic.title}</span>
              </div>
              <ArrowLeft className="w-5 h-5 text-slate-500 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>

      {/* Right Column: Sidebar Widgets (Notes widget) */}
      <div className="space-y-6">
        {/* Sticky Path Navigator (lg:block hidden) */}
        {siblingTopics.length > 0 && (
          <div className="hidden lg:block p-5 rounded-xl border border-[#202020] bg-[#0A0A0A] space-y-4 sticky top-4 z-10">
            <div className="space-y-1 border-b border-[#202020] pb-3">
              <div className="flex items-center justify-between" >
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Learning Path
                </span>
                <button
                  onClick={() => setLearningPathCollapsed(!learningPathCollapsed)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 transition hover:bg-[#151515]"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      learningPathCollapsed ? "" : "rotate-180"
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-sm font-black text-slate-200">{currentCategory}</h3>
              {/* Progress Bar */}
              {!learningPathCollapsed && (
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{completedSiblings} / {totalSiblings} Completed</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* List of siblings */}
            {!learningPathCollapsed && (
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                {siblingTopics.map((sibling, index) => {
                  const isCurrent = sibling.id === topic.id;
                  const isCompletedSibling = completedTopics[sibling.id]?.completed;
                  const isLocked = index > 0 && !completedTopics[siblingTopics[index - 1].id]?.completed && !isCompletedSibling && !isCurrent;
                  
                  return (
                    <Link
                      key={sibling.id}
                      to={isLocked ? "#" : `/topics/${sibling.id}`}
                      onClick={(e) => {
                        if (isLocked) {
                          e.preventDefault();
                          toast.info(`Please complete "${siblingTopics[index - 1].title}" first!`);
                        }
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition ${
                        isCurrent
                          ? "bg-[#1A1A1A] text-blue-400 border border-blue-500/20"
                          : isLocked
                          ? "opacity-40 cursor-not-allowed text-slate-500"
                          : "text-slate-400 hover:bg-[#151515] hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isCompletedSibling ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        ) : isCurrent ? (
                          <span className="w-3.5 h-3.5 rounded-full border border-blue-500 flex items-center justify-center flex-shrink-0">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                        )}
                        <span className="truncate">{sibling.title}</span>
                      </div>
                      {isLocked && <Lock className="w-3.5 h-3.5 text-slate-550" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Notes widget */}
        <div className="p-5 rounded-xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-500" /> Quick Topic Notes
            </h3>
            <button
              onClick={() => setNotesCollapsed(!notesCollapsed)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 transition hover:bg-[#151515]"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  notesCollapsed ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>
          {!notesCollapsed && (
            <form onSubmit={handleSaveNote} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#050505] text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Your Notes (Markdown support)
                </label>
                <textarea
                  rows={8}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type your notes on this topic. Use markdown formatting like # header or - bullet list."
                  className="w-full mt-1 p-2 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#050505] max-h-60 min-h-28 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="commands, linux, tips"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#050505] text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!noteContent.trim()}
                className="w-full py-2 bg-blue-600 disabled:opacity-55 disabled:cursor-not-allowed hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Note
              </button>
            </form>
          )}
        </div>

        {/* Prerequisites & Details overview panel */}
        <div className="p-5 rounded-xl glass-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-emerald-500" /> Topic Metadata
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-200/50 dark:border-[#202020]">
              <span className="text-slate-500">Difficulty</span>
              <span className="font-bold">{topic.difficulty}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200/50 dark:border-[#202020]">
              <span className="text-slate-500">Completed</span>
              <span className="font-bold">{isCompleted ? "Yes" : "No"}</span>
            </div>
            {topic.prerequisites?.length > 0 && (
              <div className="py-1.5 border-b border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-500">Prerequisites</span>
                <div className="flex flex-wrap gap-1">
                  {topic.prerequisites.map((p) => (
                    <span
                      key={p}
                      className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
