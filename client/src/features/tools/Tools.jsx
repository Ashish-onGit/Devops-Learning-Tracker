import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Terminal,
  Hammer,
  FileText,
  ChevronRight,
  Clipboard,
  Check,
  Info,
  HelpCircle,
  Layout,
  ArrowRight,
} from "lucide-react";
import { api } from "../../utils/api";

const Tools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedToolParam = searchParams.get("tool") || "Docker";

  // Component state
  const [tools, setTools] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [activeInstallTab, setActiveInstallTab] = useState("linux");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // List of all tools to choose from
  const toolList = [
    "Docker",
    "Kubernetes",
    "Terraform",
    "Jenkins",
    "Ansible",
    "Prometheus",
    "Grafana",
    "ArgoCD",
    "Helm",
    "Nginx",
    "Linux",
    "AWS",
  ];

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      const allTools = await api.getTools();
      setTools(allTools);

      // Load selected tool details
      const details = await api.getToolByName(selectedToolParam);
      if (details) {
        setActiveTool(details);
      } else {
        // Mock fallback if tool details not yet seeded (e.g. Nginx, Jenkins, etc.)
        setActiveTool({
          toolName: selectedToolParam,
          overview: `Comprehensive guide and documentation for ${selectedToolParam} in DevOps pipelines.`,
          installation: {
            linux: `sudo apt update && sudo apt install ${selectedToolParam.toLowerCase()} -y`,
            mac: `brew install ${selectedToolParam.toLowerCase()}`,
            windows: `winget install ${selectedToolParam}`,
          },
          architecture: `${selectedToolParam} integrates into modern DevOps automation, delivery orchestration, and configuration operations.`,
          commands: [
            {
              command: `${selectedToolParam.toLowerCase()} --version`,
              description: "Check installed version",
            },
            {
              command: `${selectedToolParam.toLowerCase()} --help`,
              description: "View usage guidelines",
            },
          ],
          examples: [
            {
              title: "Basic Setup",
              code: `# Configuration sample for ${selectedToolParam}\nversion: 1.0\nmetadata:\n  name: default-config`,
              description: `A standard placeholder configuration template for ${selectedToolParam}.`,
            },
          ],
          useCases: [
            "Automation",
            "Continuous Integration",
            "Infrastructure management",
          ],
          alternatives: ["Standard CLI tools"],
          interviewQuestions: [
            {
              question: `What is the primary role of ${selectedToolParam}?`,
              answer: `${selectedToolParam} provides essential service primitives to optimize deployments, scalability, monitoring, or configuration management.`,
            },
          ],
        });
      }
      setLoading(false);
    };
    fetchTools();
  }, [selectedToolParam]);

  const handleToolSelect = (toolName) => {
    setSearchParams({ tool: toolName });
  };

  const handleCopyCommand = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar Tool List */}
      <div className="md:col-span-1 rounded-xl glass-panel overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b border-slate-200/50 dark:border-[#202020]">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <Hammer className="w-4 h-4 text-blue-500" /> DevOps Toolchain
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {toolList.map((name) => {
            const isSelected =
              selectedToolParam.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                onClick={() => handleToolSelect(name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold text-left transition select-none ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#151515]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Terminal
                    className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-450"}`}
                  />
                  {name}
                </span>
                <ChevronRight className="w-3 h-3" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool details display */}
      <div className="md:col-span-3 rounded-xl glass-panel overflow-y-auto h-full p-6 space-y-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-850 rounded" />
            <div className="h-32 bg-slate-200 dark:bg-slate-850 rounded-lg" />
          </div>
        ) : activeTool ? (
          <>
            {/* Header info */}
            <div className="space-y-2 border-b border-slate-200/50 dark:border-[#202020] pb-4">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-200">
                {activeTool.toolName} Explorer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeTool.overview}
              </p>
            </div>

            {/* Architecture Details */}
            {activeTool.architecture && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-500" /> Architecture
                  Overview
                </h3>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-[#111111]/30 p-4 rounded-xl border border-slate-200/50 dark:border-[#202020]">
                  {activeTool.architecture}
                </p>
              </div>
            )}

            {/* Installation Guide */}
            {activeTool.installation && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Installation guidelines
                </h3>
                <div className="border border-slate-200/50 dark:border-[#202020] rounded-xl overflow-hidden">
                  <div className="flex bg-slate-100 dark:bg-[#111111]/45 border-b border-slate-200/50 dark:border-[#202020] px-2 py-1 text-[10px] font-bold">
                    <button
                      onClick={() => setActiveInstallTab("linux")}
                      className={`px-3 py-1.5 rounded transition ${
                        activeInstallTab === "linux"
                          ? "bg-slate-200 dark:bg-[#1A1A1A] text-slate-900 dark:text-white"
                          : "text-slate-500"
                      }`}
                    >
                      Linux
                    </button>
                    <button
                      onClick={() => setActiveInstallTab("mac")}
                      className={`px-3 py-1.5 rounded transition ${
                        activeInstallTab === "mac"
                          ? "bg-slate-200 dark:bg-[#1A1A1A] text-slate-900 dark:text-white"
                          : "text-slate-500"
                      }`}
                    >
                      macOS
                    </button>
                    <button
                      onClick={() => setActiveInstallTab("windows")}
                      className={`px-3 py-1.5 rounded transition ${
                        activeInstallTab === "windows"
                          ? "bg-slate-200 dark:bg-[#1A1A1A] text-slate-900 dark:text-white"
                          : "text-slate-500"
                      }`}
                    >
                      Windows
                    </button>
                  </div>
                  <div className="p-4 bg-slate-900 dark:bg-[#111111] text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre border-t border-slate-200/50 dark:border-[#202020]">
                    {activeInstallTab === "linux" &&
                      activeTool.installation.linux}
                    {activeInstallTab === "mac" && activeTool.installation.mac}
                    {activeInstallTab === "windows" &&
                      activeTool.installation.windows}
                  </div>
                </div>
              </div>
            )}

            {/* Common commands */}
            {activeTool.commands?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Interactive Command Cheat Sheet
                </h3>
                <div className="space-y-2">
                  {activeTool.commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111111] border border-slate-200/50 dark:border-[#202020] flex items-center justify-between gap-4 font-mono text-xs text-slate-600 dark:text-slate-300"
                    >
                      <div className="space-y-1">
                        <span className="text-emerald-400 font-bold">
                          $ {cmd.command}
                        </span>
                        <p className="text-[10px] text-slate-500 font-sans">
                          {cmd.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyCommand(cmd.command, idx)}
                        className="p-2 rounded bg-slate-200 hover:bg-slate-300 dark:bg-[#1A1A1A] dark:hover:bg-[#252525] text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-300 dark:border-[#333333]"
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
              </div>
            )}

            {/* Code Examples */}
            {activeTool.examples?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Configuration Examples
                </h3>
                {activeTool.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl glass-card space-y-2"
                  >
                    <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                      {ex.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ex.description}
                    </p>
                    <pre className="p-4 bg-slate-900 dark:bg-[#111111] text-slate-300 font-mono text-xs rounded-lg overflow-x-auto whitespace-pre leading-relaxed border border-slate-200/50 dark:border-[#202020]">
                      <code>{ex.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {/* Alternatives & Use Cases */}
            <div className="grid md:grid-cols-2 gap-4">
              {activeTool.useCases?.length > 0 && (
                <div className="p-5 rounded-xl glass-card">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 mb-2">
                    Ideal Use Cases
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {activeTool.useCases.map((uc, i) => (
                      <li key={i}>{uc}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTool.alternatives?.length > 0 && (
                <div className="p-5 rounded-xl glass-card">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Alternatives
                  </h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {activeTool.alternatives.map((al, i) => (
                      <li key={i}>{al}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Tool specific interviews */}
            {activeTool.interviewQuestions?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-orange-500" /> Focus
                  Interview Questions
                </h3>
                <div className="space-y-3">
                  {activeTool.interviewQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl glass-card text-xs"
                    >
                      <p className="font-bold mb-1.5 text-slate-800 dark:text-slate-200">
                        Q: {q.question}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-[#111111]/30 p-2.5 rounded border border-slate-200/50 dark:border-[#202020]">
                        {q.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center py-12 text-slate-500 text-xs">
            No tool guide loaded.
          </p>
        )}
      </div>
    </div>
  );
};

export default Tools;
