import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Globe, GitBranch, Layers, Compass, 
  PlayCircle, Cpu, Cloud, Activity, Shield, 
  Shuffle, Sparkles, Star, Award, CheckCircle, 
  Lock, ArrowRight, Play, Eye, Clipboard, BookOpen,
  HelpCircle, ChevronDown, ChevronRight, X, Flame, Check,
  BookMarked, HelpCircle as HelpIcon, ListFilter, Kanban, Network, Search
} from 'lucide-react';
import { api } from '../../utils/api';
import { toggleBookmark } from '../../store/slices/bookmarksSlice';

const Roadmap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const completedTopics = useSelector((state) => state.progress?.completedTopics || {});
  const completedProjects = useSelector((state) => state.projects?.completedProjects || []);
  const bookmarkedIds = useSelector((state) => state.bookmarks?.topics || []);
  const notes = useSelector((state) => state.notes?.notes || []);
  const streak = useSelector((state) => state.dashboard?.streak || 0);

  // Component state
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('journey'); // 'journey', 'tree', 'kanban'
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    'Foundation': true,
    'Containers': true,
    'Orchestration': true,
    'CI/CD': true,
    'IaC': true,
    'Cloud': true,
    'Monitoring': true,
    'Security': true,
    'GitOps': true,
    'Service Mesh': true,
    'Advanced': true
  });

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      const data = await api.getTopics();
      setTopics(data);
      setLoading(false);
    };
    fetchTopics();
  }, []);

  // Gamification Engine Calculations
  const calculateGamification = () => {
    let totalXp = 0;
    
    // Calculate Topic XP
    topics.forEach(t => {
      const progress = completedTopics[t.id];
      if (progress?.completed) {
        if (t.difficulty === 'Beginner') totalXp += 10;
        else if (t.difficulty === 'Intermediate') totalXp += 25;
        else if (t.difficulty === 'Advanced') totalXp += 50;
        
        // Mastery Bonus (Quiz passed)
        if (progress.quizPassed) {
          totalXp += 15;
        }
      }
    });

    // Calculate Project XP
    completedProjects.forEach(() => {
      totalXp += 100;
    });

    // Determine Level based on XP
    let level = 1;
    let levelName = 'Beginner';
    let xpNeededForNext = 100;
    let xpInCurrentLevel = totalXp;

    if (totalXp >= 1200) {
      level = 7;
      levelName = 'DevOps Architect';
      xpNeededForNext = Infinity;
      xpInCurrentLevel = totalXp - 1200;
    } else if (totalXp >= 1000) {
      level = 6;
      levelName = 'DevOps Specialist';
      xpNeededForNext = 200;
      xpInCurrentLevel = totalXp - 1000;
    } else if (totalXp >= 800) {
      level = 5;
      levelName = 'Advanced Engineer';
      xpNeededForNext = 200;
      xpInCurrentLevel = totalXp - 800;
    } else if (totalXp >= 500) {
      level = 4;
      levelName = 'DevOps Engineer';
      xpNeededForNext = 300;
      xpInCurrentLevel = totalXp - 500;
    } else if (totalXp >= 250) {
      level = 3;
      levelName = 'Practitioner';
      xpNeededForNext = 250;
      xpInCurrentLevel = totalXp - 250;
    } else if (totalXp >= 100) {
      level = 2;
      levelName = 'DevOps Explorer';
      xpNeededForNext = 150;
      xpInCurrentLevel = totalXp - 100;
    }

    const levelProgressPct = xpNeededForNext === Infinity ? 100 : Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

    return { totalXp, level, levelName, xpNeededForNext, xpInCurrentLevel, levelProgressPct };
  };

  const gamification = calculateGamification();

  // Badges Definitions
  const badgesList = [
    {
      id: 'linux-master',
      title: 'Linux Master',
      desc: 'Complete Linux Commands and Shell Scripting topics',
      icon: Terminal,
      color: 'text-amber-500 border-amber-500/30 bg-amber-500/5',
      checkUnlock: () => completedTopics['linux-commands']?.completed && completedTopics['shell-scripting']?.completed
    },
    {
      id: 'docker-expert',
      title: 'Docker Expert',
      desc: 'Complete Docker Fundamentals and Advanced Docker',
      icon: Layers,
      color: 'text-blue-500 border-blue-500/30 bg-blue-500/5',
      checkUnlock: () => completedTopics['docker-basics']?.completed && completedTopics['docker-advanced']?.completed
    },
    {
      id: 'k8s-explorer',
      title: 'Kubernetes Explorer',
      desc: 'Complete Kubernetes Core and Advanced concepts',
      icon: Compass,
      color: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/5',
      checkUnlock: () => completedTopics['kubernetes-basics']?.completed && completedTopics['kubernetes-advanced']?.completed
    },
    {
      id: 'tf-specialist',
      title: 'Terraform Specialist',
      desc: 'Complete Terraform Infrastructure as Code topic',
      icon: Cpu,
      color: 'text-purple-500 border-purple-500/30 bg-purple-500/5',
      checkUnlock: () => completedTopics['iac-terraform']?.completed
    },
    {
      id: 'aws-learner',
      title: 'AWS Learner',
      desc: 'Complete AWS Core Cloud topic',
      icon: Cloud,
      color: 'text-orange-500 border-orange-500/30 bg-orange-500/5',
      checkUnlock: () => completedTopics['cloud-aws']?.completed
    },
    {
      id: 'monitoring-ninja',
      title: 'Monitoring Ninja',
      desc: 'Complete Prometheus & Grafana Observability topic',
      icon: Activity,
      color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5',
      checkUnlock: () => completedTopics['monitoring-stack']?.completed
    },
    {
      id: 'engineer-ready',
      title: 'Engineer Ready',
      desc: 'Reach Level 4 (DevOps Engineer) or complete 5 topics',
      icon: Award,
      color: 'text-indigo-500 border-indigo-500/30 bg-indigo-500/5',
      checkUnlock: () => gamification.level >= 4 || Object.values(completedTopics).filter(t => t.completed).length >= 5
    }
  ];

  // Helper: map category/topic to Icon
  const getTopicIcon = (topicId, category) => {
    const cat = category.toLowerCase();
    if (topicId.includes('linux') || topicId.includes('scripting')) return Terminal;
    if (topicId.includes('git')) return GitBranch;
    if (topicId.includes('networking')) return Globe;
    if (topicId.includes('docker')) return Layers;
    if (topicId.includes('kubernetes') || topicId.includes('mesh')) return Compass;
    if (topicId.includes('cicd') || topicId.includes('pipeline') || topicId.includes('jenkins')) return PlayCircle;
    if (topicId.includes('iac') || topicId.includes('terraform') || topicId.includes('ansible')) return Cpu;
    if (topicId.includes('cloud') || topicId.includes('aws')) return Cloud;
    if (topicId.includes('monitoring') || topicId.includes('prometheus')) return Activity;
    if (topicId.includes('security') || topicId.includes('vault')) return Shield;
    return BookOpen;
  };

  // Helper: determine Node States
  const getTopicState = (topic) => {
    const progress = completedTopics[topic.id];
    const isCompleted = progress?.completed;
    const hasQuizPassed = progress?.quizPassed;
    
    if (isCompleted && hasQuizPassed) return 'mastered';
    if (isCompleted) return 'completed';
    
    // Check prerequisites
    const missingPrereq = topic.prerequisites?.some(preId => !completedTopics[preId]?.completed);
    if (missingPrereq) return 'locked';
    
    // Check if in progress (has bookmarks or local notes)
    const hasNotes = notes.some(n => n.topicId === topic.id);
    const isBookmarked = bookmarkedIds.includes(topic.id);
    if (hasNotes || isBookmarked) return 'in_progress';
    
    return 'available';
  };

  // Helper: get status styles for circles
  const getNodeStyles = (state) => {
    switch (state) {
      case 'mastered':
        return {
          bg: 'bg-white dark:bg-[#0A0A0A]',
          border: 'border-[#EAB308] dark:border-[#EAB308]',
          shadow: 'mastered-gold-glow dark:shadow-[0_0_15px_rgba(234,179,8,0.25)]',
          iconColor: 'text-[#EAB308]',
          iconBg: 'bg-amber-500/10 border-amber-500/20',
          statusTagBg: 'bg-amber-500/15 border-amber-500/30',
          statusTagColor: 'text-amber-500 dark:text-amber-400',
          diffColor: 'text-slate-500 dark:text-slate-400',
          badge: <Star className="w-3 h-3 fill-current text-[#EAB308]" />
        };
      case 'completed':
        return {
          bg: 'bg-white dark:bg-[#0A0A0A]',
          border: 'border-emerald-500/60 dark:border-emerald-500/50 hover:border-emerald-400',
          shadow: 'shadow-sm dark:shadow-[0_0_12px_rgba(16,185,129,0.15)]',
          iconColor: 'text-emerald-500 dark:text-emerald-400',
          iconBg: 'bg-emerald-500/10 border-emerald-500/20',
          statusTagBg: 'bg-emerald-500/10 border-emerald-500/20',
          statusTagColor: 'text-emerald-500 dark:text-emerald-400',
          diffColor: 'text-slate-500 dark:text-slate-400',
          badge: <Check className="w-3 h-3 text-emerald-500 stroke-[3.5]" />
        };
      case 'in_progress':
        return {
          bg: 'bg-white dark:bg-[#0A0A0A]',
          border: 'border-amber-500',
          shadow: 'in-progress-glow dark:shadow-[0_0_15px_rgba(245,158,11,0.25)]',
          iconColor: 'text-amber-500 dark:text-amber-400',
          iconBg: 'bg-amber-500/10 border-amber-500/20',
          statusTagBg: 'bg-amber-500/10 border-amber-500/20',
          statusTagColor: 'text-amber-500 dark:text-amber-400',
          diffColor: 'text-slate-500 dark:text-slate-400',
          badge: <Flame className="w-3 h-3 text-amber-500 fill-current animate-pulse" />
        };
      case 'locked':
        return {
          bg: 'bg-slate-50 dark:bg-[#050505] opacity-55 cursor-not-allowed',
          border: 'border-slate-200 dark:border-[#202020]',
          shadow: '',
          iconColor: 'text-slate-400 dark:text-slate-650',
          iconBg: 'bg-slate-100 dark:bg-[#0A0A0A] border-slate-200 dark:border-[#202020]',
          statusTagBg: 'bg-slate-100 dark:bg-[#111111] border-slate-200 dark:border-[#202020]',
          statusTagColor: 'text-slate-400 dark:text-slate-500',
          diffColor: 'text-slate-400 dark:text-slate-650',
          badge: <Lock className="w-3 h-3 text-slate-550" />
        };
      case 'available':
      default:
        return {
          bg: 'bg-white dark:bg-[#0A0A0A]',
          border: 'border-blue-500/60 dark:border-blue-500/50 hover:border-blue-400',
          shadow: 'shadow-sm dark:shadow-[0_0_12px_rgba(59,130,246,0.15)]',
          iconColor: 'text-blue-500 dark:text-blue-400',
          iconBg: 'bg-blue-500/10 border-blue-500/20',
          statusTagBg: 'bg-blue-500/10 border-blue-500/20',
          statusTagColor: 'text-blue-500 dark:text-blue-400',
          diffColor: 'text-slate-500 dark:text-slate-400',
          badge: <Play className="w-3 h-3 text-blue-500 fill-current" />
        };
    }
  };

  const getEstTime = (diff) => {
    if (diff === 'Beginner') return '2-3 hrs';
    if (diff === 'Intermediate') return '4-5 hrs';
    return '6-8 hrs';
  };

  const getStatusText = (state) => {
    if (state === 'mastered') return 'Mastered';
    if (state === 'completed') return 'Completed';
    if (state === 'in_progress') return 'In Progress';
    if (state === 'locked') return 'Locked';
    return 'Available';
  };

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleBookmarkToggle = (e, topicId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleBookmark({ type: 'topics', id: topicId }));
  };

  // Filter topics
  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    'Foundation', 'Containers', 'Orchestration', 'CI/CD', 
    'IaC', 'Cloud', 'Monitoring', 'Security', 'GitOps', 'Service Mesh', 'Advanced'
  ];

  // Derive next recommended topic (first available or in-progress)
  const getNextRecommended = () => {
    for (const cat of categories) {
      const catTopics = topics.filter(t => t.category === cat || (cat === 'Service Mesh' && t.category === 'ServiceMesh'));
      for (const t of catTopics) {
        const state = getTopicState(t);
        if (state === 'in_progress' || state === 'available') {
          return t;
        }
      }
    }
    return null;
  };
  const nextRecommended = getNextRecommended();

  // Calculate overall completion percentage
  const totalCount = topics.length || 1;
  const completedCount = Object.values(completedTopics).filter(t => t.completed).length;
  const completionPct = Math.round((completedCount / totalCount) * 100);

  const staggerClasses = [
    'justify-start pl-6 md:pl-20',
    'justify-center',
    'justify-end pr-6 md:pr-20'
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Title & View Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-100">DevOps Learning Journey</h2>
          <p className="text-xs text-slate-500">Earn XP, level up, unlock achievement badges, and master infrastructure engineering step-by-step.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none w-48"
            />
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0A0A0A] p-1 rounded-lg border border-slate-200/50 dark:border-[#202020] select-none">
            <button
              onClick={() => setViewMode('journey')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition ${
                viewMode === 'journey' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" /> Journey
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition ${
                viewMode === 'tree' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Tree View
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
          <div className="h-64 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
        </div>
      ) : (
        <>
          {/* Gamified Roadmap Header Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: XP Progress Bar & Level */}
            <div className="lg:col-span-2 p-5 glass-card flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Active Learning Profile</span>
                  <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-1.5">
                    Level {gamification.level}: <span className="text-blue-400">{gamification.levelName}</span>
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-500 font-bold bg-orange-500/5 px-2.5 py-1 rounded-full border border-orange-500/10">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse" /> {streak} Day Streak
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">Current XP: {gamification.totalXp} XP</span>
                  <span className="text-slate-400">
                    {gamification.xpNeededForNext === Infinity ? 'MAX Level reached' : `${gamification.xpInCurrentLevel}/${gamification.xpNeededForNext} XP to Next Level`}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300" style={{ width: `${gamification.levelProgressPct}%` }} />
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-800/50 pt-3.5 mt-4 text-center">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Completed</p>
                  <p className="text-sm font-black text-slate-200">{completedCount} Topics</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Projects</p>
                  <p className="text-sm font-black text-slate-200">{completedProjects.length} Done</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Notes Written</p>
                  <p className="text-sm font-black text-slate-200">{notes.length} Pages</p>
                </div>
              </div>
            </div>

            {/* Column 2: Progress Ring & Next Recommendation */}
            <div className="p-5 glass-card flex items-center justify-between gap-4">
              {/* Circular progress SVG */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-slate-950 fill-none" strokeWidth="6" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    className="stroke-blue-600 fill-none transition-all duration-500" 
                    strokeWidth="6" 
                    strokeDasharray="213.6"
                    strokeDashoffset={213.6 - (213.6 * completionPct) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="text-xs font-black text-slate-200">{completionPct}%</span>
                  <span className="text-[7px] text-slate-500 font-bold uppercase mt-0.5">Mastery</span>
                </div>
              </div>

              {/* Recommendation card */}
              <div className="flex-1 space-y-2 select-none">
                <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase">Recommended Next</span>
                {nextRecommended ? (
                  <div 
                    onClick={() => setSelectedTopic(nextRecommended)}
                    className="p-2  rounded-lg bg-slate-950 border border-slate-800/50 hover:border-blue-500/35 transition cursor-pointer text-left space-y-1"
                  >
                    <p className="text-[11px] font-extrabold text-slate-200 truncate">{nextRecommended.title}</p>
                    <p className="text-[9px] text-slate-500">{nextRecommended.summary}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-500 font-bold">All topics completed! You are DevOps Certified!</p>
                )}
              </div>
            </div>
          </div>

          {/* Badges Shelf section */}
          <div className="p-4 glass-card">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-500" /> Unlocked Achievement Badges</h4>
            <div className="flex flex-wrap gap-3">
              {badgesList.map(badge => {
                const isUnlocked = badge.checkUnlock();
                const BadgeIcon = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    title={`${badge.title}: ${badge.desc}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition select-none ${
                      isUnlocked 
                        ? badge.color
                        : 'text-slate-600 border-slate-900 bg-slate-950 opacity-40'
                    }`}
                  >
                    <BadgeIcon className="w-4 h-4" />
                    <span>{badge.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core views layout */}
          <div>
            {/* View Mode 1: Journey View (Duolingo visual path) */}
            {viewMode === 'journey' && (
              <div className="roadmap-mesh-container border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center max-w-4xl mx-auto space-y-12 py-12">
                {/* Central progress connector tracks */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-slate-200 dark:bg-[#202020] -translate-x-1/2 hidden md:block z-0" />
                <div 
                  className="absolute top-0 left-1/2 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500 to-emerald-500 -translate-x-1/2 transition-all duration-1000 hidden md:block z-0"
                  style={{ height: `${completionPct}%` }}
                />

                {categories.map((cat, catIdx) => {
                  const catTopics = filteredTopics.filter(t => 
                    t.category === cat || (cat === 'Service Mesh' && t.category === 'ServiceMesh')
                  );
                  if (catTopics.length === 0) return null;

                  return (
                    <div key={cat} className="w-full space-y-8 z-10 relative">
                      {/* Milestone Category Label */}
                      <div className="flex justify-center select-none my-4">
                        <div className="px-5 py-2 rounded-full border border-slate-200 dark:border-[#202020] bg-white dark:bg-[#050505] text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 shadow-md flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          {cat} Milestone
                        </div>
                      </div>

                      {/* Staggered Milestone Cards */}
                      <div className="flex flex-col w-full relative">
                        {catTopics.map((topic, topicIdx) => {
                          const isLeft = topicIdx % 2 === 0;
                          const state = getTopicState(topic);
                          const styles = getNodeStyles(state);
                          const TopicIcon = getTopicIcon(topic.id, topic.category);
                          const statusText = getStatusText(state);
                          const estTime = getEstTime(topic.difficulty);

                          return (
                            <div key={topic.id} className="relative flex items-center justify-center w-full py-4">
                              {/* Horizontal connector line on desktop */}
                              <div 
                                className={`absolute top-1/2 -translate-y-1/2 h-[2px] w-[240px] hidden md:block transition-all duration-300 ${
                                  isLeft ? 'right-1/2' : 'left-1/2'
                                } ${
                                  state === 'completed' || state === 'mastered'
                                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500'
                                    : state === 'in_progress'
                                    ? 'bg-gradient-to-r from-slate-700 to-amber-500'
                                    : 'bg-slate-200 dark:bg-[#202020]'
                                } z-0`}
                              />

                              {/* Card container wrapper with offset */}
                              <div className={`w-full flex justify-center md:w-auto z-10 ${
                                isLeft ? 'md:pr-[240px]' : 'md:pl-[240px]'
                              }`}>
                                {/* Milestone Node Card */}
                                <motion.div 
                                  initial={{ opacity: 0, y: 15 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  whileHover={state !== 'locked' ? { scale: 1.03, y: -4 } : {}}
                                  whileTap={state !== 'locked' ? { scale: 0.98 } : {}}
                                  onClick={() => state !== 'locked' && setSelectedTopic(topic)}
                                  className={`relative flex flex-col p-4 rounded-xl border transition-all duration-200 select-none ${
                                    state !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'
                                  } w-full max-w-[280px] md:w-[280px] ${styles.bg} ${styles.border} ${styles.shadow}`}
                                >
                                  {/* Top: Icon container & Status pill */}
                                  <div className="flex items-center justify-between gap-3">
                                    <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconColor}`}>
                                      <TopicIcon className="w-4 h-4" />
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${styles.statusTagBg} ${styles.statusTagColor}`}>
                                      {statusText}
                                    </div>
                                  </div>

                                  {/* Middle: Title */}
                                  <h4 className="mt-3 font-extrabold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">
                                    {topic.title}
                                  </h4>

                                  {/* Bottom: Difficulty & Estimated Time */}
                                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-2 text-[9px] font-bold text-slate-550 dark:text-slate-550">
                                    <span className={styles.iconColor}>{topic.difficulty}</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                      {estTime}
                                    </span>
                                  </div>

                                  {/* Floating Corner Indicator Badge */}
                                  {styles.badge && (
                                    <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#202020] shadow-md">
                                      {styles.badge}
                                    </div>
                                  )}
                                </motion.div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View Mode 2: Tree View (Structured list tree) */}
            {viewMode === 'tree' && (
              <div className="space-y-4 max-w-4xl mx-auto">
                {categories.map((cat, catIdx) => {
                  const catTopics = filteredTopics.filter(t => 
                    t.category === cat || (cat === 'Service Mesh' && t.category === 'ServiceMesh')
                  );
                  if (catTopics.length === 0) return null;

                  const isExpanded = expandedCategories[cat];
                  const completedCountInCat = catTopics.filter(t => completedTopics[t.id]?.completed).length;

                  return (
                    <div 
                      key={cat}
                      className="rounded-xl border border-slate-200 dark:border-[#202020] overflow-hidden bg-white dark:bg-[#0A0A0A] shadow-md"
                    >
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-[#050505] font-bold text-xs border-b border-slate-200 dark:border-[#202020] hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-[10px] font-black">
                            {catIdx + 1}
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 font-extrabold">{cat}</span>
                          <span className="text-[9px] font-bold bg-slate-100 dark:bg-[#111111] px-2.5 py-0.5 rounded border border-slate-200 dark:border-[#202020] text-slate-550 dark:text-slate-400">
                            {completedCountInCat} / {catTopics.length} Completed
                          </span>
                        </div>
                        <div className="text-slate-500">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-slate-50/50 dark:bg-black/20 grid sm:grid-cols-2 gap-4">
                          {catTopics.map(topic => {
                            const state = getTopicState(topic);
                            const styles = getNodeStyles(state);
                            const TopicIcon = getTopicIcon(topic.id, topic.category);

                            return (
                              <div
                                key={topic.id}
                                onClick={() => state !== 'locked' && setSelectedTopic(topic)}
                                className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-200 bg-white dark:bg-[#0A0A0A] cursor-pointer hover:border-blue-500/40 hover:shadow-lg hover:-translate-y-[1.5px] ${
                                  state === 'locked' ? 'opacity-40 border-slate-200 dark:border-[#202020]' : 'border-slate-200 dark:border-[#202020]'
                                }`}
                              >
                                <div className={`relative h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconColor}`}>
                                  <TopicIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 truncate">{topic.title}</h4>
                                  <p className="text-[10px] text-slate-505 dark:text-slate-500 truncate mt-0.5">{topic.summary}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* View Mode 3: Kanban View (Interactive columns) */}
            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto select-none">
                {/* Column 1: Available */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-[#202020] bg-slate-50 dark:bg-[#050505] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#202020] pb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase flex items-center gap-1.5"><HelpIcon className="w-4 h-4 text-blue-500" /> Available (Locked)</span>
                    <span className="text-[9px] font-bold bg-slate-100 dark:bg-[#111111] border dark:border-slate-800 px-2 py-0.5 rounded text-slate-550">
                      {filteredTopics.filter(t => getTopicState(t) === 'available' || getTopicState(t) === 'locked').length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredTopics.map(topic => {
                      const state = getTopicState(topic);
                      if (state !== 'available' && state !== 'locked') return null;
                      const styles = getNodeStyles(state);

                      return (
                        <div 
                          key={topic.id}
                          onClick={() => state !== 'locked' && setSelectedTopic(topic)}
                          className={`p-3.5 rounded-lg border border-slate-200 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] hover:border-blue-500/35 transition cursor-pointer flex gap-3 items-center ${
                            state === 'locked' ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className={`relative w-8 h-8 rounded border flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconColor}`}>
                            {state === 'locked' ? <Lock className="w-3.5 h-3.5 text-slate-650" /> : <Play className="w-3.5 h-3.5 text-blue-450" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{topic.title}</p>
                            <p className="text-[9px] text-slate-505 uppercase mt-0.5">{topic.difficulty}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-[#202020] bg-slate-50 dark:bg-[#050505] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#202020] pb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-500 animate-pulse" /> In Progress</span>
                    <span className="text-[9px] font-bold bg-slate-100 dark:bg-[#111111] border dark:border-slate-800 px-2 py-0.5 rounded text-slate-555">
                      {filteredTopics.filter(t => getTopicState(t) === 'in_progress').length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredTopics.filter(t => getTopicState(t) === 'in_progress').length === 0 ? (
                      <p className="text-[10px] text-slate-500 py-6 text-center">No topics currently in progress.</p>
                    ) : (
                      filteredTopics.map(topic => {
                        if (getTopicState(topic) !== 'in_progress') return null;
                        const styles = getNodeStyles('in_progress');
                        return (
                          <div 
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic)}
                            className="p-3.5 rounded-lg border border-slate-200 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] hover:border-blue-500/35 transition cursor-pointer flex gap-3 items-center"
                          >
                            <div className={`relative w-8 h-8 rounded border flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconColor}`}>
                              <Flame className="w-3.5 h-3.5 text-amber-500 fill-current animate-pulse" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{topic.title}</p>
                              <p className="text-[9px] text-slate-500 uppercase mt-0.5">{topic.difficulty}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Column 3: Completed / Mastered */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-[#202020] bg-slate-50 dark:bg-[#050505] space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#202020] pb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Completed</span>
                    <span className="text-[9px] font-bold bg-slate-100 dark:bg-[#111111] border dark:border-slate-800 px-2 py-0.5 rounded text-slate-555">
                      {filteredTopics.filter(t => getTopicState(t) === 'completed' || getTopicState(t) === 'mastered').length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredTopics.filter(t => getTopicState(t) === 'completed' || getTopicState(t) === 'mastered').length === 0 ? (
                      <p className="text-[10px] text-slate-500 py-6 text-center">No completed topics yet.</p>
                    ) : (
                      filteredTopics.map(topic => {
                        const state = getTopicState(topic);
                        if (state !== 'completed' && state !== 'mastered') return null;
                        const styles = getNodeStyles(state);

                        return (
                          <div 
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic)}
                            className="p-3.5 rounded-lg border border-slate-200 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] hover:border-blue-500/35 transition cursor-pointer flex gap-3 items-center"
                          >
                            <div className={`relative w-8 h-8 rounded border flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconColor}`}>
                              {state === 'mastered' ? <Star className="w-3.5 h-3.5 text-purple-400 fill-current text-[#EAB308]" /> : <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{topic.title}</p>
                              <p className="text-[9px] text-slate-550 uppercase mt-0.5">{topic.difficulty}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Slide-over Side Drawer details panel (Framer Motion backdrop overlay & slide panel) */}
      <AnimatePresence>
        {selectedTopic && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTopic(null)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Slide Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-[#050505] border-l border-slate-200 dark:border-[#202020] shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#202020] pb-4 select-none">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      selectedTopic.difficulty === 'Beginner' ? 'bg-blue-500/10 text-blue-400' :
                      selectedTopic.difficulty === 'Intermediate' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {selectedTopic.difficulty}
                    </span>
                    <span className="text-[8px] bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#202020] px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 uppercase tracking-widest">{selectedTopic.category}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTopic(null)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#151515] text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Content */}
                <div className="mt-5 space-y-5 overflow-y-auto max-h-[calc(100vh-170px)] pr-1">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{selectedTopic.title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Est: {selectedTopic.difficulty === 'Beginner' ? '2-3 hours' : selectedTopic.difficulty === 'Intermediate' ? '4-5 hours' : '6-8 hours'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Concept Summary</h4>
                    <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#000000] p-4 rounded-xl border border-slate-200 dark:border-[#202020]">
                      {selectedTopic.summary}
                    </p>
                  </div>

                  {/* Skills learned Fallback list */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skills Acquired</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(selectedTopic.id === 'linux-commands'
                        ? ['CLI Navigation', 'Pipe Streams', 'Process Management', 'Text Manipulation']
                        : selectedTopic.id === 'docker-basics'
                        ? ['Virtualization', 'Image Build', 'Layers Caching', 'Compose stacks']
                        : selectedTopic.id === 'kubernetes-basics'
                        ? ['Control Plane', 'Pod Deployment', 'Service Discovery', 'Scalability']
                        : selectedTopic.id === 'iac-terraform'
                        ? ['Declarative state', 'Provider setups', 'Variables modules', 'Plan executions']
                        : ['DevOps automation', 'CI/CD flows', 'Cloud networking', 'Config states']
                      ).map(skill => (
                        <div key={skill} className="p-2 rounded-lg bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#202020] flex items-center gap-1.5 text-[10px] font-bold text-slate-655 dark:text-slate-350">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Counters */}
                  <div className="grid grid-cols-3 gap-3 border-t border-slate-200 dark:border-slate-800/50 pt-4 mt-4 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-[#0A0A0A] rounded-xl border border-slate-200 dark:border-[#202020]">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Quizzes</p>
                      <p className="text-xs font-black text-slate-750 dark:text-slate-300 mt-1">1 Test</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#0A0A0A] rounded-xl border border-slate-200 dark:border-[#202020]">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Projects</p>
                      <p className="text-xs font-black text-slate-750 dark:text-slate-300 mt-1">1 Build</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#0A0A0A] rounded-xl border border-slate-200 dark:border-[#202020]">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Interview Qs</p>
                      <p className="text-xs font-black text-slate-750 dark:text-slate-300 mt-1">1-2 Qs</p>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {selectedTopic.prerequisites?.length > 0 && (
                    <div className="space-y-1.5 p-3 rounded-lg border border-red-500/10 bg-red-500/5 text-[10px] text-slate-550 dark:text-slate-400 font-medium">
                      <p className="font-bold text-red-500 dark:text-red-400 uppercase tracking-wider">Prerequisite Dependencies</p>
                      <p className="mt-1">Must complete: <b>{selectedTopic.prerequisites.map(pId => {
                        const found = topics.find(t => t.id === pId);
                        return found ? found.title : pId;
                      }).join(', ')}</b></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer footer CTA button */}
              <div className="border-t border-slate-250 dark:border-[#202020] pt-4 bg-white dark:bg-[#050505] z-10 shrink-0">
                <button
                  onClick={() => {
                    navigate(`/topics/${selectedTopic.id}`);
                    setSelectedTopic(null);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15"
                >
                  <Play className="w-4 h-4 fill-current" /> Launch Learning Module
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component wrapper icons
function Clock(props) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// Sub-component check mark icon
function CheckCircle2(props) {
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
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default Roadmap;
