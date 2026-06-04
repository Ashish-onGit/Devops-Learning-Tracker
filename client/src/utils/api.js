import axios from 'axios';
import { seedData } from './seedData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${API_BASE_URL}/api/v1`;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

const generateFallbackContent = (topicId, topicTitle, category) => {
  return {
    topicId,
    overview: `Comprehensive guide to ${topicTitle} in DevOps environments.`,
    theory: `${topicTitle} is a core competency under the ${category} category in modern DevOps engineering.\n\nIt establishes the foundations of automated deployment, reliability pipelines, infrastructure repeatability, and cluster scalability.\n\nDevOps practitioners use this framework to increase agility, decrease time-to-market, and enforce configuration compliance across cloud-native platforms.`,
    visualExplanation: `+---------------------------------------+\n|       Local Developer Workspace       |\n+---------------------------------------+\n                   │\n                   ▼ (Deploy/Sync Command)\n+---------------------------------------+\n|       Target Environment State        |\n+---------------------------------------+`,
    realWorldExample: `In enterprise production clusters, ${topicTitle} is used to orchestrate application resources, secure credentials, monitor latency, or configure ingress paths dynamically.`,
    commands: [
      { command: `${topicId.toLowerCase()} --help`, description: "Display usage guidelines and active parameters" },
      { command: `${topicId.toLowerCase()} status`, description: "Check current system configuration and running status logs" }
    ],
    bestPractices: [
      `Enforce security baselines and least privilege access early.`,
      `Version control all configuration parameters and scripts.`,
      `Implement centralized telemetry logging and tracing.`
    ],
    commonMistakes: [
      `Using default credentials or leaving configurations unencrypted.`,
      `Hardcoding environmental variables instead of using dynamic parameters.`
    ],
    labs: [
      {
        title: `${topicTitle} Hands-On Challenge`,
        steps: [
          `Verify the installation status using the terminal.`,
          `Explore the configuration parameters folder.`,
          `Deploy a sample template resources configuration.`,
          `Validate active outputs and system diagnostics.`
        ]
      }
    ],
    miniProject: {
      title: `${topicTitle} Production Script`,
      description: `Create a modular script to automate configuration setup and status checks for ${topicTitle}.`,
      steps: [
        "Initialize the workspace environment.",
        "Write the core automation configurations.",
        "Perform dry-run checks and syntax validation.",
        "Execute and inspect running outputs."
      ],
      solution: `# DevOps Automation Script for ${topicTitle}\necho "Initializing ${topicTitle} configuration..."\n# Automated checks\nexit 0`
    }
  };
};

const generateFallbackQuiz = (topicId, topicTitle) => {
  return {
    topicId,
    questions: [
      {
        questionText: `What is the primary role of ${topicTitle} in DevOps architectures?`,
        options: [
          "To optimize software delivery speed and reliability",
          "To serve as a simple database backup storage unit",
          "To compile programming source code files",
          "To replace standard security firewalls"
        ],
        correctIndex: 0,
        explanation: `${topicTitle} helps automate operations, scale infrastructure, or deliver secure code pipelines.`
      },
      {
        questionText: `Which of the following is a recommended best practice for ${topicTitle}?`,
        options: [
          "Expose all credentials in plain text",
          "Adhere to the principle of least privilege and automate configurations",
          "Modify resources manually directly in production consoles",
          "Avoid using telemetry logging and alert notifications"
        ],
        correctIndex: 1,
        explanation: "Automation, security validation, and least privilege are core to modern DevOps methodologies."
      }
    ]
  };
};

export const api = {
  getTopics: async () => {
    try {
      const res = await apiClient.get('/topics');
      return res.data.data;
    } catch (e) {
      console.warn('API error, falling back to local topics seed data:', e.message);
      return seedData.topics;
    }
  },

  getTopicById: async (id) => {
    try {
      const res = await apiClient.get(`/topics/${id}`);
      return res.data.data;
    } catch (e) {
      console.warn(`API error, falling back to local topic content for ${id}:`, e.message);
      const topic = seedData.topics.find(t => t.id === id);
      if (!topic) return null;
      let content = seedData.topicContents.find(c => c.topicId === id);
      let quiz = seedData.quizzes.find(q => q.topicId === id);
      if (!content) {
        content = generateFallbackContent(id, topic.title, topic.category);
      }
      if (!quiz) {
        quiz = generateFallbackQuiz(id, topic.title);
      }
      return {
        ...topic,
        content: content || null,
        quiz: quiz || null
      };
    }
  },

  getTools: async () => {
    try {
      const res = await apiClient.get('/tools');
      return res.data.data;
    } catch (e) {
      console.warn('API error, falling back to local tools seed data:', e.message);
      return seedData.tools;
    }
  },

  getToolByName: async (name) => {
    try {
      const res = await apiClient.get(`/tools/${name}`);
      return res.data.data;
    } catch (e) {
      console.warn(`API error, falling back to local tool guide for ${name}:`, e.message);
      return seedData.tools.find(t => t.toolName.toLowerCase() === name.toLowerCase()) || null;
    }
  },

  getProjects: async () => {
    try {
      const res = await apiClient.get('/projects');
      return res.data.data;
    } catch (e) {
      console.warn('API error, falling back to local projects seed data:', e.message);
      return seedData.projects;
    }
  },

  getInterviewQuestions: async (category = '', difficulty = '') => {
    try {
      const res = await apiClient.get('/interviews', {
        params: { category, difficulty }
      });
      return res.data.data;
    } catch (e) {
      console.warn('API error, falling back to local interview questions:', e.message);
      let result = seedData.interviewQuestions;
      if (category) {
        result = result.filter(q => q.category.toLowerCase() === category.toLowerCase());
      }
      if (difficulty) {
        result = result.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }
      return result;
    }
  },

  getCertifications: async () => {
    try {
      const res = await apiClient.get('/certifications');
      return res.data.data;
    } catch (e) {
      console.warn('API error, falling back to local certifications:', e.message);
      return seedData.certifications;
    }
  },

  searchGlobal: async (query) => {
    try {
      const res = await apiClient.get(`/search`, { params: { q: query } });
      return res.data.data;
    } catch (e) {
      console.warn('API error, falling back to local search index:', e.message);
      const q = query.toLowerCase();
      const topics = seedData.topics.filter(t => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q));
      const tools = seedData.tools.filter(t => t.toolName.toLowerCase().includes(q) || t.overview.toLowerCase().includes(q));
      const projects = seedData.projects.filter(p => p.title.toLowerCase().includes(q) || p.goal.toLowerCase().includes(q));
      const interviews = seedData.interviewQuestions.filter(i => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q));
      return {
        topics,
        tools,
        projects,
        interviews
      };
    }
  }
};
