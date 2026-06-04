import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Award, Briefcase, CheckCircle2, ChevronRight, FileText, 
  HelpCircle, Sparkles, TrendingUp, AlertCircle, Compass, Play
} from 'lucide-react';
import { api } from '../../utils/api';

const Career = () => {
  // Redux state
  const completedTopics = useSelector((state) => state.progress?.completedTopics || {});
  const completedProjects = useSelector((state) => state.projects?.completedProjects || []);
  const completedInterviewQuestions = useSelector((state) => state.interview?.completedQuestions || []);
  const checkedDomains = useSelector((state) => state.certifications?.checkedDomains || {});

  // Component state
  const [totalTopicsCount, setTotalTopicsCount] = useState(21);
  const [resumeItems, setResumeItems] = useState([
    { id: 'res-1', text: 'Includes clear Linux administration and bash scripting keywords', checked: false },
    { id: 'res-2', text: 'Details container optimization experience (multi-stage Docker builds)', checked: false },
    { id: 'res-3', text: 'Showcases CI/CD pipeline automation (GitHub Actions or Jenkins syntax)', checked: false },
    { id: 'res-4', text: 'Documents Infrastructure-as-Code state files management (Terraform)', checked: false },
    { id: 'res-5', text: 'References Prometheus metric alerts or observability configurations', checked: false }
  ]);
  
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 'port-1', text: 'Hosted personal domain with SSL/TLS reverse proxy setup', checked: false },
    { id: 'port-2', text: 'Public Git repository containing declarative Terraform manifests', checked: false },
    { id: 'port-3', text: 'Live demonstration project of Kubernetes cluster pod deployments', checked: false },
    { id: 'port-4', text: 'Configured automated health-check alerts via Slack/Email webhook', checked: false }
  ]);

  useEffect(() => {
    const fetchTopics = async () => {
      const allTopics = await api.getTopics();
      if (allTopics.length > 0) {
        setTotalTopicsCount(allTopics.length);
      }
    };
    fetchTopics();

    // Load checklists from local storage if they exist
    try {
      const savedResume = localStorage.getItem('career_resume_checklist');
      const savedPort = localStorage.getItem('career_portfolio_checklist');
      if (savedResume) setResumeItems(JSON.parse(savedResume));
      if (savedPort) setPortfolioItems(JSON.parse(savedPort));
    } catch (e) {}
  }, []);

  const handleResumeToggle = (id) => {
    const updated = resumeItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    setResumeItems(updated);
    localStorage.setItem('career_resume_checklist', JSON.stringify(updated));
  };

  const handlePortfolioToggle = (id) => {
    const updated = portfolioItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    setPortfolioItems(updated);
    localStorage.setItem('career_portfolio_checklist', JSON.stringify(updated));
  };

  // Calculations for readiness score:
  // Topics: 40% weight (based on completed topics)
  // Projects: 35% weight (based on completed projects out of 4)
  // Interview Practice: 15% weight (based on answered interview questions, target 4)
  // Certifications: 10% weight (based on checklist progress)

  const topicsCompletedCount = Object.values(completedTopics).filter(t => t.completed).length;
  const topicsPct = totalTopicsCount > 0 ? (topicsCompletedCount / totalTopicsCount) : 0;
  
  const projectsPct = Math.min(completedProjects.length / 4, 1);
  
  const interviewPct = Math.min(completedInterviewQuestions.length / 4, 1);
  
  const totalCertsChecked = Object.values(checkedDomains).reduce((acc, curr) => acc + curr.length, 0);
  const certsPct = Math.min(totalCertsChecked / 10, 1);

  const rawScore = (topicsPct * 40) + (projectsPct * 35) + (interviewPct * 15) + (certsPct * 10);
  const jobReadinessScore = Math.round(rawScore);

  // Determine title based on score
  let careerTitle = 'Beginner DevOps Learner';
  let titleColor = 'text-slate-500';
  let progressDescription = 'Build your knowledge by reading core roadmap guides and taking quizzes.';

  if (jobReadinessScore >= 80) {
    careerTitle = 'Production-Ready Cloud DevOps Engineer';
    titleColor = 'text-emerald-600 dark:text-emerald-450';
    progressDescription = 'Excellent preparation! Your portfolio is complete. You are fully ready to apply for junior/mid DevOps roles.';
  } else if (jobReadinessScore >= 50) {
    careerTitle = 'Associate DevOps Candidate';
    titleColor = 'text-blue-500';
    progressDescription = 'Great progress! Focus on building intermediate CI/CD pipelines and Kubernetes projects to reach job-readiness.';
  } else if (jobReadinessScore >= 20) {
    careerTitle = 'DevOps Intern Ready';
    titleColor = 'text-orange-500';
    progressDescription = 'Good foundation. Complete more topics and mark your first hands-on project complete to step up.';
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Career Preparation Center</h2>
        <p className="text-xs text-slate-500">Track and calculate your market job-readiness score, optimize your resumes, and check off portfolio items.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Readiness score card */}
        <div className="p-6 rounded-xl glass-card flex flex-col justify-between text-center space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5 justify-center"><Compass className="w-4 h-4 text-blue-500" /> Readiness score</h3>
          
          {/* Radial representation */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            {/* Simple circular background graphic via SVG */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="60" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="transparent" />
              <circle 
                cx="72" 
                cy="72" 
                r="60" 
                className="stroke-blue-600 dark:stroke-blue-400 transition-all duration-500" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * jobReadinessScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute space-y-0.5">
              <span className="text-3xl font-black">{jobReadinessScore}%</span>
              <p className="text-[9px] text-slate-450 uppercase font-extrabold">Ready</p>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className={`text-xs font-extrabold ${titleColor}`}>{careerTitle}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed px-4">{progressDescription}</p>
          </div>

          <div className="border-t border-slate-200/50 dark:border-[#202020] pt-3 text-[10px] text-left text-slate-400 space-y-2">
            <p className="font-semibold text-slate-500">Readiness Score Weights:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>Roadmap (40%): <span className="font-bold text-slate-650 dark:text-slate-300">{Math.round(topicsPct * 100)}%</span></div>
              <div>Projects (35%): <span className="font-bold text-slate-650 dark:text-slate-300">{Math.round(projectsPct * 100)}%</span></div>
              <div>Interviews (15%): <span className="font-bold text-slate-650 dark:text-slate-300">{Math.round(interviewPct * 100)}%</span></div>
              <div>Certs (10%): <span className="font-bold text-slate-650 dark:text-slate-300">{Math.round(certsPct * 100)}%</span></div>
            </div>
          </div>
        </div>

        {/* Center: Resume Checklist */}
        <div className="p-6 rounded-xl glass-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><FileText className="w-4 h-4 text-orange-500" /> Resume Keywords checklist</h3>
          <p className="text-[11px] text-slate-500">Ensure your resume contains action statements detailing these key technical metrics:</p>
          <div className="space-y-2 select-none">
            {resumeItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleResumeToggle(item.id)}
                className={`p-3 rounded-lg border cursor-pointer flex gap-3 items-center transition ${
                  item.checked 
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-slate-800 dark:text-slate-200' 
                    : 'border-slate-200/50 dark:border-[#202020] hover:bg-slate-50 dark:hover:bg-[#151515] text-slate-500'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                  item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-[#202020]'
                }`}>
                  {item.checked && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[10px] font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Portfolio Checklist */}
        <div className="p-6 rounded-xl glass-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-500" /> Portfolio Architecture</h3>
          <p className="text-[11px] text-slate-500">Establish your active online presence to show recruiters operational systems code:</p>
          <div className="space-y-2 select-none">
            {portfolioItems.map(item => (
              <div
                key={item.id}
                onClick={() => handlePortfolioToggle(item.id)}
                className={`p-3 rounded-lg border cursor-pointer flex gap-3 items-center transition ${
                  item.checked 
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-slate-800 dark:text-slate-200' 
                    : 'border-slate-200/50 dark:border-[#202020] hover:bg-slate-50 dark:hover:bg-[#151515] text-slate-500'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                  item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-[#202020]'
                }`}>
                  {item.checked && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[10px] font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
