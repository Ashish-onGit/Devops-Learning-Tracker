import React, { useState } from "react";
import {
  BookOpen,
  GitBranch,
  Star,
  Heart,
  ExternalLink,
  Search,
  Rss,
  ArrowUpRight,
  Code,
  MessageSquare,
} from "lucide-react";

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Sample static high-quality community resources
  const repos = [
    {
      title: "awesome-devops",
      owner: "Jitsusama",
      description:
        "A curated list of awesome DevOps platforms, tools, frameworks, and resources.",
      stars: "14.2k",
      forks: "2.5k",
      category: "General",
      url: "https://github.com/Jitsusama/awesome-devops",
    },
    {
      title: "kubernetes",
      owner: "kubernetes",
      description:
        "Production-Grade Container Scheduling and Management System.",
      stars: "105.4k",
      forks: "38.2k",
      category: "Containers",
      url: "https://github.com/kubernetes/kubernetes",
    },
    {
      title: "terraform-provider-aws",
      owner: "hashicorp",
      description:
        "The Terraform AWS provider allows Terraform to configure AWS infrastructure.",
      stars: "9.8k",
      forks: "4.1k",
      category: "IaC",
      url: "https://github.com/hashicorp/terraform-provider-aws",
    },
    {
      title: "argo-cd",
      owner: "argoproj",
      description:
        "Declarative GitOps Continuous Delivery tool for Kubernetes.",
      stars: "16.5k",
      forks: "4.8k",
      category: "GitOps",
      url: "https://github.com/argoproj/argo-cd",
    },
  ];

  const articles = [
    {
      title: "How We Scaled Our Kubernetes Cluster to 5,000 Nodes",
      author: "David Vance",
      source: "Dev.to",
      likes: 342,
      comments: 48,
      category: "Containers",
      readTime: "6 min read",
      url: "https://dev.to/t/devops",
    },
    {
      title: "Mastering Terraform State: Common Anti-patterns and Solutions",
      author: "Helen Park",
      source: "Medium / DevOps",
      likes: 219,
      comments: 15,
      category: "IaC",
      readTime: "8 min read",
      url: "https://medium.com/tag/devops",
    },
    {
      title: "DevSecOps Checklist: Shifting Security Left in GitHub Actions",
      author: "Alex Mercer",
      source: "Dev.to",
      likes: 189,
      comments: 29,
      category: "Security",
      readTime: "5 min read",
      url: "https://dev.to/t/security",
    },
    {
      title: "OSI Model Explained: A DevOps Engineer's Perspective",
      author: "Marcus Aurelius",
      source: "Dev.to",
      likes: 540,
      comments: 65,
      category: "General",
      readTime: "10 min read",
      url: "https://dev.to/t/networking",
    },
  ];

  const categories = [
    "All",
    "General",
    "Containers",
    "IaC",
    "GitOps",
    "Security",
  ];

  // Filter items
  const filteredRepos = repos.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  const filteredArticles = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Title & search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">DevOps Resource Hub</h2>
          <p className="text-xs text-slate-500">
            Explore trending GitHub repositories, DevOps articles, and RSS
            updates from the community.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200/50 dark:border-[#202020] bg-white dark:bg-[#0A0A0A] focus:ring-1 focus:ring-blue-500 focus:outline-none w-64"
          />
        </div>
      </div>

      {/* Category Selection pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/50 dark:border-[#202020] select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: GitHub Repos */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-500" /> Trending GitHub
            Repositories
          </h3>

          <div className="space-y-4">
            {filteredRepos.length === 0 ? (
              <p className="text-xs text-slate-500 py-6">
                No matching repositories found.
              </p>
            ) : (
              filteredRepos.map((repo) => (
                <a
                  key={repo.title}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-xl glass-card block space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-405 font-semibold">
                        {repo.owner} /
                      </p>
                      <h4 className="font-extrabold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        {repo.title} <ArrowUpRight className="w-3.5 h-3.5" />
                      </h4>
                    </div>
                    <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase">
                      {repo.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {repo.description}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold border-t border-slate-200/50 dark:border-[#202020] pt-2.5">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />{" "}
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5 text-blue-500" />{" "}
                      {repo.forks}
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Right: Dev.to Articles */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Rss className="w-4 h-4 text-orange-500" /> Community Articles &
            Blogs
          </h3>

          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <p className="text-xs text-slate-500 py-6">
                No matching articles found.
              </p>
            ) : (
              filteredArticles.map((art) => (
                <a
                  key={art.title}
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-xl glass-card block space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase">
                        {art.source}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1 group-hover:text-blue-500">
                        {art.title}{" "}
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-200/50 dark:border-[#202020] pt-2.5">
                    <span className="text-slate-500">
                      By {art.author} • {art.readTime}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />{" "}
                        {art.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />{" "}
                        {art.comments}
                      </span>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
