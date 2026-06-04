import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle,
  Star,
  Play,
  Award,
  Sparkles,
  Filter,
  ChevronDown,
  Check,
  RefreshCw,
} from "lucide-react";
import { api } from "../../utils/api";
import {
  toggleQuestionCompleted,
  addMockSession,
} from "../../store/slices/interviewSlice";
import { useToast } from "../../hooks/useToast";

const Interviews = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Redux state
  const completedQuestions = useSelector(
    (state) => state.interview?.completedQuestions || [],
  );
  const mockSessions = useSelector(
    (state) => state.interview?.mockSessions || [],
  );

  // Component state
  const [questions, setQuestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // Mock interview simulator state
  const [mockActive, setMockActive] = useState(false);
  const [mockCategory, setMockCategory] = useState("Docker");
  const [mockQuestions, setMockQuestions] = useState([]);
  const [mockAnswersVisible, setMockAnswersVisible] = useState({});
  const [mockScores, setMockScores] = useState({}); // { index: true/false }
  const [mockSessionSubmitted, setMockSessionSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await api.getInterviewQuestions();
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  const handleRevealToggle = (idx) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleQuestionCompletedToggle = (qText) => {
    dispatch(toggleQuestionCompleted(qText));
    const isCompleted = completedQuestions.includes(qText);
    if (isCompleted) {
      toast.info("Question marked incomplete");
    } else {
      toast.success("Question marked complete");
    }
  };

  // Mock Interview helpers
  const handleStartMock = () => {
    const catQs = questions.filter(
      (q) => q.category.toLowerCase() === mockCategory.toLowerCase(),
    );
    if (catQs.length === 0) {
      toast.warning("Not enough questions available for this category yet.");
      return;
    }

    const shuffled = [...catQs].sort(() => 0.5 - Math.random());
    setMockQuestions(shuffled.slice(0, 3));
    setMockAnswersVisible({});
    setMockScores({});
    setMockSessionSubmitted(false);
    setMockActive(true);
    toast.info(`Mock session started for ${mockCategory}`);
  };

  const handleMockScoreSelect = (idx, scoreVal) => {
    setMockScores((prev) => ({
      ...prev,
      [idx]: scoreVal,
    }));
  };

  const handleSubmitMock = () => {
    const gradedCount = Object.keys(mockScores).length;
    if (gradedCount < mockQuestions.length) {
      toast.warning(
        "Please grade yourself on all questions before submitting.",
      );
      return;
    }

    const correctCount = Object.values(mockScores).filter(
      (val) => val === "correct",
    ).length;
    const finalScorePercent = Math.round(
      (correctCount / mockQuestions.length) * 100,
    );

    dispatch(
      addMockSession({
        category: mockCategory,
        score: finalScorePercent,
        totalQuestions: mockQuestions.length,
      }),
    );

    setMockSessionSubmitted(true);
    toast.success(
      `Mock interview session graded! Score: ${finalScorePercent}%`,
    );
  };

  const categories = [
    "All",
    "Linux",
    "Docker",
    "Kubernetes",
    "Terraform",
    "AWS",
    "Networking",
    "Security",
  ];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory =
      activeCategory === "All" ||
      q.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesDifficulty =
      activeDifficulty === "All" ||
      q.difficulty.toLowerCase() === activeDifficulty.toLowerCase();
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1 & 2: Question Explorer */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              Systems Interview Preparation Hub
            </h2>
            <p className="text-xs text-slate-500">
              Practice core troubleshooting scenarios, Linux questions, and
              container networking challenges.
            </p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="p-4 rounded-xl glass-panel flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 self-start md:self-auto select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 self-end md:self-auto select-none">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Difficulty
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold border transition ${
                  activeDifficulty === diff
                    ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-950 dark:border-white"
                    : "text-slate-500 border-slate-200 dark:border-slate-800"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <p className="text-center py-12 text-slate-500 text-xs">
              No matching practice questions found.
            </p>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isCompleted = completedQuestions.includes(q.question);
              const isRevealed = revealedAnswers[idx] || false;

              return (
                <div
                  key={idx}
                  onClick={() => handleRevealToggle(idx)}
                  className={`p-5 rounded-xl glass-card space-y-3 cursor-pointer ${
                    isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/[0.01]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase">
                        {q.category} • {q.difficulty}
                      </span>
                      <h3 className="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                        {q.question}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuestionCompletedToggle(q.question);
                      }}
                      className={`p-1.5 rounded-lg border transition ${
                        isCompleted
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                          : "border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Collapse Answer trigger */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRevealToggle(idx);
                      }}
                      
                      className="px-3 py-1.5 rounded bg-slate-150 hover:bg-slate-200 dark:bg-[#202020] dark:hover:bg-[#151515] text-[10px] font-bold text-slate-600 dark:text-zinc-300 flex items-center gap-1.5 border border-slate-200/50 dark:border-[#202020]"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Hide Answer Outline
                        </>
                      ) : (
                        <>
                        
                          <Eye className="w-3.5 h-3.5" /> Reveal Model Answer
                        </>
                      )}
                    </button>
                  </div>

                  {/* Collapsed Answer View */}
                  {isRevealed && (
                    <div className="p-4 rounded-lg bg-slate-50/50 dark:bg-[#111111]/80 border border-slate-200/50 dark:border-[#202020] text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-sans whitespace-pre-line">
                      <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1 border-b border-slate-200/50 dark:border-slate-800/50 pb-1">
                        Recommended Response Model:
                      </p>
                      {q.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column 3: Mock Interview Panel */}
      <div className="space-y-6">
        {/* Mock Interview Simulator card */}
        <div className="p-5 rounded-xl glass-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500 animate-spin" /> Mock
            Interview Simulator
          </h3>

          {!mockActive ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Start a timed 3-question evaluation. Select your focus category,
                read questions, evaluate your response structures, and log
                performance scores.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Category Track
                </label>
                <select
                  value={mockCategory}
                  onChange={(e) => setMockCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] text-xs focus:outline-none"
                >
                  <option value="Linux">Linux & Systems</option>
                  <option value="Docker">Docker Containers</option>
                  <option value="Kubernetes">Kubernetes Orchestration</option>
                  <option value="Terraform">Terraform IaC</option>
                </select>
              </div>

              <button
                onClick={handleStartMock}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 transition"
              >
                <Play className="w-4 h-4 fill-current" /> Begin Mock Session
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-orange-500 uppercase">
                  {mockCategory} mock session
                </span>
                <button
                  onClick={() => setMockActive(false)}
                  className="text-[10px] text-slate-500 hover:underline"
                >
                  Cancel
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {mockQuestions.map((q, idx) => {
                  const hasGraded = mockScores[idx] !== undefined;
                  const isCorrect = mockScores[idx] === "correct";
                  const showAns = mockAnswersVisible[idx] || false;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white/50 dark:bg-[#111111]/85 space-y-2"
                    >
                      <p className="font-bold text-xs">
                        Q{idx + 1}: {q.question}
                      </p>

                      <button
                        onClick={() =>
                          setMockAnswersVisible((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className="text-[10px] text-blue-500 hover:underline flex items-center gap-1"
                      >
                        {showAns
                          ? "Hide response guide"
                          : "Reveal response guide"}
                      </button>

                      {showAns && (
                        <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-100 dark:bg-[#111111] p-2 rounded border border-slate-200/50 dark:border-[#202020]">
                          {q.answer}
                        </p>
                      )}

                      {/* Score Selector */}
                      {!mockSessionSubmitted ? (
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={() =>
                              handleMockScoreSelect(idx, "correct")
                            }
                            className={`flex-1 py-1 rounded text-[9px] font-bold border transition ${
                              mockScores[idx] === "correct"
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                                : "border-slate-200 text-slate-400 hover:bg-slate-50"
                            }`}
                          >
                            ✓ Correct Response
                          </button>
                          <button
                            onClick={() =>
                              handleMockScoreSelect(idx, "incorrect")
                            }
                            className={`flex-1 py-1 rounded text-[9px] font-bold border transition ${
                              mockScores[idx] === "incorrect"
                                ? "bg-red-500/10 border-red-500 text-red-650"
                                : "border-slate-200 text-slate-400 hover:bg-slate-50"
                            }`}
                          >
                            ✗ Incorrect/Missed
                          </button>
                        </div>
                      ) : (
                        <div className="text-[9px] font-bold flex items-center gap-1 mt-2">
                          {isCorrect ? (
                            <span className="text-emerald-600">
                              ✓ Marked Correct
                            </span>
                          ) : (
                            <span className="text-red-550">
                              ✗ Marked Incorrect
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!mockSessionSubmitted ? (
                <button
                  onClick={handleSubmitMock}
                  className="w-full py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs rounded-lg transition dark:bg-[#1A1A1A] dark:hover:bg-[#252525]"
                >
                  Grade & Submit Session
                </button>
              ) : (
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p className="text-xs text-center font-bold text-slate-500">
                    Grading Complete! Score:{" "}
                    <span className="text-blue-500">
                      {Math.round(
                        (Object.values(mockScores).filter(
                          (v) => v === "correct",
                        ).length /
                          mockQuestions.length) *
                          100,
                      )}
                      %
                    </span>
                  </p>
                  <button
                    onClick={() => setMockActive(false)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-700 font-bold text-xs rounded-lg transition border dark:border-slate-800"
                  >
                    Close Session Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mock Session History logs list */}
        <div className="p-5 rounded-xl glass-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" /> Simulator History
            Logs
          </h3>
          {mockSessions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No completed mock sessions yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...mockSessions].reverse().map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-lg border border-slate-200/50 dark:border-[#202020] bg-slate-50/20 dark:bg-[#111111]/30 flex justify-between items-center text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold">{session.category} Mock</span>
                    <p className="text-[10px] text-slate-450">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-black ${
                      session.score >= 60
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                        : "bg-red-500/10 text-red-650"
                    }`}
                  >
                    {session.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interviews;
