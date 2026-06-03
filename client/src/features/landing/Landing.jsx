import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Terminal,
  Shield,
  Workflow,
  Database,
  Cpu,
  Award,
  Star,
  CheckCircle,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "25+", label: "DevOps Topics Covered" },
    { value: "100+", label: "Hands-on Commands" },
    { value: "15+", label: "Interactive Quizzes" },
    { value: "5+", label: "Production-Grade Projects" },
  ];

  const features = [
    {
      icon: Terminal,
      title: "Interactive Command Center",
      description:
        "Explore and copy syntax cheat sheets for Nginx, Git, Linux, Docker, and Kubernetes configurations.",
    },
    {
      icon: Workflow,
      title: "Visual Architecture Diagrams",
      description:
        "Review clear text and visual layouts explaining pipelines, networks, load balancers, and pod routings.",
    },
    {
      icon: Shield,
      title: "DevSecOps & Secrets Vault",
      description:
        "Learn modern security practices using HashiCorp Vault, container vulnerability scanning, and RBAC policies.",
    },
    {
      icon: Award,
      title: "Certification Trackers",
      description:
        "Prepare systematically for AWS Associate/Professional, CKA, CKAD, CKS, and Terraform certifications.",
    },
  ];

  const tracks = [
    {
      title: "Linux & Networks Foundation",
      topics: "Commands, Filesystem, SSH, DNS, Load Balancers",
      duration: "2 Weeks",
      level: "Beginner",
    },
    {
      title: "Cloud & Containerization",
      topics: "Docker, AWS EC2, S3, VPC Networking, Compose",
      duration: "3 Weeks",
      level: "Intermediate",
    },
    {
      title: "Container Orchestration",
      topics: "Kubernetes Pods, Deployments, Services, Helm, Ingress",
      duration: "4 Weeks",
      level: "Advanced",
    },
    {
      title: "Modern GitOps & IaC",
      topics: "Terraform Modules, State, Ansible Playbooks, ArgoCD",
      duration: "3 Weeks",
      level: "Advanced",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Cloud Engineer at Netflix",
      text: "DevOps Compass helped me prepare for the CKA exam and organize my learning notes. The roadmap.sh-style tree is incredibly satisfying to complete!",
    },
    {
      name: "Marcus Brody",
      role: "Site Reliability Engineer",
      text: "The interview preparation questions are top-tier. Scenario questions closely matched the actual interviews I had at AWS and Google.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white font-sans">
      {/* Navbar overlay */}
      <nav className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-slate-200/50 dark:border-slate-800/50 glass-nav sticky top-0 z-35">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20">
            DC
          </span>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            DevOps Compass
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition duration-150 flex items-center gap-1.5 shadow-sm"
        >
          Enter Platform <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Glow graphic */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 -z-10 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold mb-6 animate-pulse">
          <Cpu className="w-3.5 h-3.5" /> Launch your DevOps Career Path
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
          Master the{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
            DevOps Ecosystem
          </span>{" "}
          From Scratch
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          DevOps Compass maps out structural roadmaps, container labs, IaC
          modules, cheat sheets, and systems interview question banks.
          Everything you need to go from terminal beginner to production
          engineer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => navigate("/roadmap")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition duration-150 shadow-md shadow-blue-500/20 text-sm flex items-center gap-2 justify-center"
          >
            Explore Interactive Roadmap <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition duration-150 font-semibold text-sm justify-center"
          >
            Open Dashboard
          </button>
        </div>

        {/* Hero mockup graphic */}
        <div className="w-full max-w-4xl p-2 rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative">
          <div className="h-6 flex items-center gap-1.5 px-4 bg-slate-100 dark:bg-black rounded-t-xl border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="text-[10px] text-slate-400 ml-4 font-mono select-none">
              devops-compass-dashboard
            </span>
          </div>
          <div className="p-4 bg-slate-900 rounded-b-xl text-left font-mono text-xs md:text-sm text-slate-300 min-h-[220px] flex flex-col justify-between overflow-x-auto">
            <div>
              <p className="text-emerald-400">
                $ devops-compass init --learner-mode=active
              </p>
              <p className="text-slate-500">
                Initializing DevOps learning workspace components...
              </p>
              <p className="text-slate-400">
                ✓ Loading Foundation Modules (Linux Commands, SSH, OSI
                Networking, Git)
              </p>
              <p className="text-slate-400">
                ✓ Mounting Container Engines (Docker, Compose layers,
                multi-stage builds)
              </p>
              <p className="text-slate-400">
                ✓ Checking Container Orchestrations (Kubernetes Deployments,
                Ingress, RBAC)
              </p>
              <p className="text-slate-400">
                ✓ Provisioning Infrastructure-as-Code resources (Terraform,
                Ansible roles)
              </p>
              <p className="text-blue-400">
                ⚡ Status: DevOps Workspace ready! 21 Learning modules loaded
                locally.
              </p>
            </div>
            <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between text-slate-500 text-[10px]">
              <span>Host IP: 127.0.0.1</span>
              <span>Port Bind: 3000 -&gt; 5000</span>
              <span>MERN Fallback: Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-100/50 dark:bg-slate-900/20 py-12 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                {stat.value}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Structured Features built for Tech Candidates
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl glass-card hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 flex gap-4"
            >
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg h-fit">
                <feat.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold">{feat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="py-16 bg-slate-100/50 dark:bg-slate-900/20 border-t border-slate-200/50 dark:border-slate-800/50 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Structured Learning Paths
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition duration-200"
              >
                <div className="space-y-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      track.level === "Beginner"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : track.level === "Intermediate"
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {track.level}
                  </span>
                  <h3 className="font-bold text-sm leading-snug">
                    {track.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {track.topics}
                  </p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Duration
                  </span>
                  <span className="font-semibold">{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Learners Success Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl glass-card flex flex-col justify-between border border-slate-200/40 relative"
            >
              <Star className="w-8 h-8 text-yellow-500/15 absolute right-6 top-6 fill-current" />
              <p className="text-slate-600 dark:text-slate-400 text-xs italic leading-relaxed mb-4">
                "{test.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{test.name}</h4>
                  <p className="text-[10px] text-slate-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 text-center bg-blue-600 text-white px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-black">
            Accelerate Your DevOps Career Readiness Today
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            Create notes, practice scenarios, track certifications, and check
            your job readiness score in real-time.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition duration-150 shadow-lg shadow-blue-800/20 text-sm"
          >
            Get Started For Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
