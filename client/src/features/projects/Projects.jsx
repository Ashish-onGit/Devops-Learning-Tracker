import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Code,
  Check,
} from "lucide-react";
import { api } from "../../utils/api";
import {
  toggleProjectStep,
  toggleProjectCompleted,
} from "../../store/slices/projectsSlice";

const Projects = () => {
  const dispatch = useDispatch();

  // Redux state
  const completedSteps = useSelector(
    (state) => state.projects?.completedSteps || {},
  );
  const completedProjects = useSelector(
    (state) => state.projects?.completedProjects || [],
  );

  // Component state
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedProject, setExpandedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
      if (data.length > 0) {
        setExpandedProject(data[0].title);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const handleToggleStep = (projectTitle, stepIndex) => {
    dispatch(toggleProjectStep({ projectTitle, stepIndex }));
  };

  const handleToggleProjectComplete = (projectTitle) => {
    dispatch(toggleProjectCompleted(projectTitle));
  };

  const categories = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Production",
  ];

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    return (
      activeCategory === "All" ||
      p.category.toLowerCase() === activeCategory.toLowerCase()
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">
          Hands-On DevOps Projects Portfolio
        </h2>
        <p className="text-xs text-slate-500">
          Build resume-worthy architectures. Check off steps as you implement
          them locally or in the cloud.
        </p>
      </div>

      {/* Categories Filter bar */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-12 bg-slate-200 dark:bg-slate-850 rounded-lg animate-pulse" />
          <div className="h-12 bg-slate-200 dark:bg-slate-850 rounded-lg animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Projects list */}
          <div className="lg:col-span-2 space-y-4">
            {filteredProjects.length === 0 ? (
              <p className="text-center py-12 text-slate-500 text-xs">
                No projects found in this category.
              </p>
            ) : (
              filteredProjects.map((proj) => {
                const isExpanded = expandedProject === proj.title;
                const doneSteps = completedSteps[proj.title] || [];
                const isProjectDone = completedProjects.includes(proj.title);
                const progressPct =
                  proj.steps?.length > 0
                    ? Math.round((doneSteps.length / proj.steps.length) * 100)
                    : 0;

                return (
                  <div
                    key={proj.title}
                    className={`rounded-xl transition-all duration-300 overflow-hidden glass-panel border ${
                      isProjectDone
                        ? "border-[#10B981]/50 bg-[#0A0A0A] shadow-md shadow-emerald-950/10 hover:border-[#10B981]/70"
                        : isExpanded
                          ? "border-blue-500/40 bg-[#0A0A0A] hover:border-blue-500/60"
                          : "border-slate-200/50 dark:border-[#202020] bg-[#0A0A0A] hover:border-slate-350 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Project Header toggle summary */}
                    <button
                      onClick={() =>
                        setExpandedProject(isExpanded ? null : proj.title)
                      }
                      className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                    >
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              proj.category === "Beginner"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : proj.category === "Intermediate"
                                  ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {proj.category}
                          </span>
                          {isProjectDone && (
                            <span className="flex items-center gap-1 text-[9px] font-extrabold text-[#FAFAFA] bg-[#10B981] px-2 py-0.5 rounded shadow-sm animate-pulse">
                              <Check className="w-3 h-3 stroke-[3]" /> Completed Successfully
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-sm md:text-base">
                          {proj.title}
                        </h3>
                      </div>

                      {/* Accordion and progress */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-slate-400 font-bold">
                            Steps Progress
                          </p>
                          <p className="text-xs font-black">
                            {progressPct}% Complete
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Collapsible Details Body */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-slate-200/50 dark:border-[#202020] pt-4 space-y-4 text-xs">
                        {/* Goal */}
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-slate-800 dark:text-slate-300">
                            Project Goal
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            {proj.goal}
                          </p>
                        </div>

                        {/* Architecture */}
                        {proj.architectureDescription && (
                          <div className="p-4 rounded-lg bg-slate-50/50 dark:bg-[#111111]/80 border border-slate-200/50 dark:border-[#202020] text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                            <span className="text-blue-400 font-bold font-sans text-xs">
                              Architecture Blueprint
                            </span>
                            <p className="mt-1.5">
                              {proj.architectureDescription}
                            </p>
                          </div>
                        )}

                        {/* Checklist Steps */}
                        {proj.steps?.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-bold text-slate-800 dark:text-slate-300">
                              Implementation Steps
                            </h4>
                            <div className="space-y-1.5 select-none">
                              {proj.steps.map((step, sIdx) => {
                                const isChecked = doneSteps.includes(sIdx);
                                return (
                                  <div
                                    key={sIdx}
                                    onClick={() =>
                                      handleToggleStep(proj.title, sIdx)
                                    }
                                    className={`p-3 rounded-lg border cursor-pointer transition flex gap-3 items-center ${
                                      isChecked
                                        ? "border-emerald-500/20 bg-emerald-500/5 text-slate-700 dark:text-slate-300"
                                        : "border-slate-200/50 dark:border-[#202020] hover:bg-slate-50 dark:hover:bg-[#151515] text-slate-500"
                                    }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                        isChecked
                                          ? "bg-emerald-500 border-emerald-500 text-white"
                                          : "border-slate-300 dark:border-[#202020]"
                                      }`}
                                    >
                                      {isChecked && (
                                        <Check className="w-3 h-3 stroke-[3]" />
                                      )}
                                    </div>
                                    <span className="text-[11px] font-semibold">
                                      {step}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {isProjectDone && (
                          <div className="p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 flex items-start gap-3 text-slate-300 animate-fadeIn mb-4">
                            <Check className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5 stroke-[3]" />
                            <div>
                              <h5 className="font-extrabold text-[#FAFAFA] text-xs">Achievement Unlocked: Completed Successfully!</h5>
                              <p className="text-[10px] text-[#A1A1AA] mt-1">You have successfully implemented all architecture steps for this hands-on deployment scenario.</p>
                            </div>
                          </div>
                        )}

                        {/* Expected outcome & Action */}
                        <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-[#202020] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-slate-300">
                              Expected Outcome
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {proj.expectedOutcome}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleToggleProjectComplete(proj.title)
                            }
                            className={`px-5 py-2.5 rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                              isProjectDone
                                ? "bg-[#10B981] hover:bg-[#059669] text-[#FAFAFA] shadow-md shadow-emerald-500/20"
                                : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 border border-slate-200 dark:border-[#202020]"
                            }`}
                          >
                            {isProjectDone ? (
                              <>
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>Project Completed</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Mark Project Finished</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Portfolio Statistics widget */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl glass-card space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" /> Portfolio
                Progress
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200/50 dark:border-[#202020] pb-2">
                  <span className="text-slate-500">Completed Projects</span>
                  <span className="font-bold text-[#10B981]">
                    {completedProjects.length} / {projects.length}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 dark:border-[#202020] pb-2">
                  <span className="text-slate-500">
                    Project checklist steps checked
                  </span>
                  <span className="font-bold">
                    {Object.values(completedSteps).reduce(
                      (acc, curr) => acc + curr.length,
                      0,
                    )}{" "}
                    steps
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
