const Topic = require('../models/Topic');
const TopicContent = require('../models/TopicContent');
const Quiz = require('../models/Quiz');
const InterviewQuestion = require('../models/InterviewQuestion');
const ToolGuide = require('../models/ToolGuide');
const Project = require('../models/Project');
const CertificationPath = require('../models/CertificationPath');
const Note = require('../models/Note');
const Resource = require('../models/Resource');
const seedData = require('../data/seedData');

let dbConnected = false;

const setDbStatus = (status) => {
  dbConnected = status;
};

const getDbStatus = () => {
  return dbConnected;
};

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

// =========================================================================
// TOPICS MODULE
// =========================================================================

const getTopics = async () => {
  if (dbConnected) {
    return await Topic.find({});
  }
  return seedData.topics;
};

const getTopicById = async (id) => {
  if (dbConnected) {
    const topic = await Topic.findOne({ id });
    if (!topic) return null;
    let content = await TopicContent.findOne({ topicId: id });
    let quiz = await Quiz.findOne({ topicId: id });

    // Generate fallbacks if missing
    if (!content) {
      content = generateFallbackContent(id, topic.title, topic.category);
    }
    if (!quiz) {
      quiz = generateFallbackQuiz(id, topic.title);
    }

    return {
      ...topic.toObject(),
      content: content ? (content.toObject ? content.toObject() : content) : null,
      quiz: quiz ? (quiz.toObject ? quiz.toObject() : quiz) : null
    };
  }
  
  const topic = seedData.topics.find(t => t.id === id);
  if (!topic) return null;
  let content = seedData.topicContents.find(c => c.topicId === id);
  let quiz = seedData.quizzes.find(q => q.topicId === id);

  // Generate fallbacks if missing
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
};

const getTopicsByCategory = async (category) => {
  if (dbConnected) {
    return await Topic.find({ category: new RegExp(`^${category}$`, 'i') });
  }
  return seedData.topics.filter(t => t.category.toLowerCase() === category.toLowerCase());
};

const searchTopics = async (query) => {
  if (!query) return [];
  const regex = new RegExp(query, 'i');
  if (dbConnected) {
    return await Topic.find({ $or: [{ title: regex }, { summary: regex }] });
  }
  const q = query.toLowerCase();
  return seedData.topics.filter(t => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q));
};

const createTopic = async (data) => {
  if (dbConnected) {
    const topic = new Topic(data);
    return await topic.save();
  }
  const newTopic = { id: data.id || `topic-${Date.now()}`, ...data };
  seedData.topics.push(newTopic);
  return newTopic;
};

const updateTopic = async (id, data) => {
  if (dbConnected) {
    return await Topic.findOneAndUpdate({ id }, data, { new: true });
  }
  const idx = seedData.topics.findIndex(t => t.id === id);
  if (idx === -1) return null;
  seedData.topics[idx] = { ...seedData.topics[idx], ...data };
  return seedData.topics[idx];
};

const deleteTopic = async (id) => {
  if (dbConnected) {
    return await Topic.findOneAndDelete({ id });
  }
  const idx = seedData.topics.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const deleted = seedData.topics[idx];
  seedData.topics.splice(idx, 1);
  return deleted;
};

// =========================================================================
// TOOLS MODULE
// =========================================================================

const getTools = async () => {
  if (dbConnected) {
    return await ToolGuide.find({});
  }
  return seedData.tools;
};

const getToolByName = async (name) => {
  if (dbConnected) {
    return await ToolGuide.findOne({ toolName: new RegExp(`^${name}$`, 'i') });
  }
  return seedData.tools.find(t => t.toolName.toLowerCase() === name.toLowerCase()) || null;
};

const getToolsByCategory = async (category) => {
  if (dbConnected) {
    return await ToolGuide.find({ category: new RegExp(`^${category}$`, 'i') });
  }
  return seedData.tools.filter(t => t.category && t.category.toLowerCase() === category.toLowerCase());
};

const createTool = async (data) => {
  if (dbConnected) {
    const tool = new ToolGuide(data);
    return await tool.save();
  }
  const newTool = {
    toolName: data.toolName || data.name,
    name: data.name || data.toolName,
    ...data
  };
  seedData.tools.push(newTool);
  return newTool;
};

const updateTool = async (id, data) => {
  if (dbConnected) {
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await ToolGuide.findByIdAndUpdate(id, data, { new: true });
    }
    return await ToolGuide.findOneAndUpdate({ toolName: id }, data, { new: true });
  }
  const idx = seedData.tools.findIndex(t => t.toolName === id || t._id === id);
  if (idx === -1) return null;
  seedData.tools[idx] = { ...seedData.tools[idx], ...data };
  return seedData.tools[idx];
};

const deleteTool = async (id) => {
  if (dbConnected) {
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await ToolGuide.findByIdAndDelete(id);
    }
    return await ToolGuide.findOneAndDelete({ toolName: id });
  }
  const idx = seedData.tools.findIndex(t => t.toolName === id || t._id === id);
  if (idx === -1) return null;
  const deleted = seedData.tools[idx];
  seedData.tools.splice(idx, 1);
  return deleted;
};

// =========================================================================
// RESOURCES MODULE
// =========================================================================

const getResources = async (type) => {
  if (dbConnected) {
    const query = type ? { type } : {};
    return await Resource.find(query);
  }
  if (type) {
    return seedData.resources.filter(r => r.type === type);
  }
  return seedData.resources;
};

const getResourceById = async (id) => {
  if (dbConnected) {
    return await Resource.findById(id);
  }
  return seedData.resources.find(r => r._id === id || r.title === id) || null;
};

const getResourcesByCategory = async (category) => {
  if (dbConnected) {
    return await Resource.find({ category: new RegExp(`^${category}$`, 'i') });
  }
  return seedData.resources.filter(r => r.category.toLowerCase() === category.toLowerCase());
};

const createResource = async (data) => {
  if (dbConnected) {
    const resource = new Resource(data);
    return await resource.save();
  }
  const newResource = { _id: `res-${Date.now()}`, ...data };
  seedData.resources.push(newResource);
  return newResource;
};

const updateResource = async (id, data) => {
  if (dbConnected) {
    return await Resource.findByIdAndUpdate(id, data, { new: true });
  }
  const idx = seedData.resources.findIndex(r => r._id === id);
  if (idx === -1) return null;
  seedData.resources[idx] = { ...seedData.resources[idx], ...data };
  return seedData.resources[idx];
};

const deleteResource = async (id) => {
  if (dbConnected) {
    return await Resource.findByIdAndDelete(id);
  }
  const idx = seedData.resources.findIndex(r => r._id === id);
  if (idx === -1) return null;
  const deleted = seedData.resources[idx];
  seedData.resources.splice(idx, 1);
  return deleted;
};

// =========================================================================
// NOTES MODULE
// =========================================================================

const getNotes = async () => {
  if (dbConnected) {
    return await Note.find({});
  }
  return seedData.notes;
};

const getNoteById = async (id) => {
  if (dbConnected) {
    return await Note.findOne({ id });
  }
  return seedData.notes.find(n => n.id === id) || null;
};

const createNote = async (data) => {
  if (dbConnected) {
    const note = new Note({
      id: data.id || Math.random().toString(36).substring(2, 9),
      ...data
    });
    return await note.save();
  }
  const newNote = {
    id: data.id || Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
  };
  seedData.notes.push(newNote);
  return newNote;
};

const updateNote = async (id, data) => {
  if (dbConnected) {
    return await Note.findOneAndUpdate({ id }, data, { new: true });
  }
  const idx = seedData.notes.findIndex(n => n.id === id);
  if (idx === -1) return null;
  seedData.notes[idx] = { ...seedData.notes[idx], ...data, updatedAt: new Date().toISOString() };
  return seedData.notes[idx];
};

const deleteNote = async (id) => {
  if (dbConnected) {
    return await Note.findOneAndDelete({ id });
  }
  const idx = seedData.notes.findIndex(n => n.id === id);
  if (idx === -1) return null;
  const deleted = seedData.notes[idx];
  seedData.notes.splice(idx, 1);
  return deleted;
};

const searchNotes = async (query) => {
  if (!query) return [];
  const regex = new RegExp(query, 'i');
  if (dbConnected) {
    return await Note.find({ $or: [{ title: regex }, { content: regex }, { category: regex }] });
  }
  const q = query.toLowerCase();
  return seedData.notes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.content.toLowerCase().includes(q) ||
    n.category.toLowerCase().includes(q)
  );
};

// =========================================================================
// PROJECTS MODULE
// =========================================================================

const getProjects = async () => {
  if (dbConnected) {
    return await Project.find({});
  }
  return seedData.projects;
};

const getProjectById = async (id) => {
  if (dbConnected) {
    return await Project.findById(id);
  }
  return seedData.projects.find(p => p._id === id || p.title === id) || null;
};

const getProjectsByLevel = async (level) => {
  if (dbConnected) {
    return await Project.find({ category: new RegExp(`^${level}$`, 'i') });
  }
  return seedData.projects.filter(p => p.category.toLowerCase() === level.toLowerCase());
};

const createProject = async (data) => {
  if (dbConnected) {
    const project = new Project(data);
    return await project.save();
  }
  const newProj = { _id: `proj-${Date.now()}`, ...data };
  seedData.projects.push(newProj);
  return newProj;
};

const updateProject = async (id, data) => {
  if (dbConnected) {
    return await Project.findByIdAndUpdate(id, data, { new: true });
  }
  const idx = seedData.projects.findIndex(p => p._id === id);
  if (idx === -1) return null;
  seedData.projects[idx] = { ...seedData.projects[idx], ...data };
  return seedData.projects[idx];
};

const deleteProject = async (id) => {
  if (dbConnected) {
    return await Project.findByIdAndDelete(id);
  }
  const idx = seedData.projects.findIndex(p => p._id === id);
  if (idx === -1) return null;
  const deleted = seedData.projects[idx];
  seedData.projects.splice(idx, 1);
  return deleted;
};

// =========================================================================
// INTERVIEWS MODULE
// =========================================================================

const getInterviewQuestions = async (category, difficulty) => {
  if (dbConnected) {
    let query = {};
    if (category) query.category = new RegExp(`^${category}$`, 'i');
    if (difficulty) query.difficulty = difficulty;
    return await InterviewQuestion.find(query);
  }
  
  let result = seedData.interviewQuestions;
  if (category) {
    result = result.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }
  if (difficulty) {
    result = result.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  return result;
};

const getInterviewQuestionById = async (id) => {
  if (dbConnected) {
    return await InterviewQuestion.findById(id);
  }
  return seedData.interviewQuestions.find(q => q._id === id) || null;
};

const getInterviewQuestionsByTopic = async (topic) => {
  if (dbConnected) {
    return await InterviewQuestion.find({ category: new RegExp(`^${topic}$`, 'i') });
  }
  return seedData.interviewQuestions.filter(q => q.category.toLowerCase() === topic.toLowerCase());
};

const createInterviewQuestion = async (data) => {
  if (dbConnected) {
    const q = new InterviewQuestion(data);
    return await q.save();
  }
  const newQ = { _id: `int-${Date.now()}`, ...data };
  seedData.interviewQuestions.push(newQ);
  return newQ;
};

const updateInterviewQuestion = async (id, data) => {
  if (dbConnected) {
    return await InterviewQuestion.findByIdAndUpdate(id, data, { new: true });
  }
  const idx = seedData.interviewQuestions.findIndex(q => q._id === id);
  if (idx === -1) return null;
  seedData.interviewQuestions[idx] = { ...seedData.interviewQuestions[idx], ...data };
  return seedData.interviewQuestions[idx];
};

const deleteInterviewQuestion = async (id) => {
  if (dbConnected) {
    return await InterviewQuestion.findByIdAndDelete(id);
  }
  const idx = seedData.interviewQuestions.findIndex(q => q._id === id);
  if (idx === -1) return null;
  const deleted = seedData.interviewQuestions[idx];
  seedData.interviewQuestions.splice(idx, 1);
  return deleted;
};

// =========================================================================
// CERTIFICATIONS MODULE
// =========================================================================

const getCertifications = async () => {
  if (dbConnected) {
    return await CertificationPath.find({});
  }
  return seedData.certifications;
};

// =========================================================================
// DASHBOARD MODULE
// =========================================================================

const getDashboardData = async () => {
  // Aggregate stats across all entities
  const topicsList = await getTopics();
  const toolsList = await getTools();
  const projectsList = await getProjects();
  const interviewQuestionsList = await getInterviewQuestions();

  const totalTopicsCount = topicsList.length;
  const totalToolsCount = toolsList.length;
  const totalProjectsCount = projectsList.length;
  const totalInterviewsCount = interviewQuestionsList.length;

  return {
    progress: 33, // Default calculated percentage progress
    statistics: {
      totalTopics: totalTopicsCount,
      completedCount: Math.round(totalTopicsCount * 0.33),
      totalTools: totalToolsCount,
      totalProjects: totalProjectsCount,
      totalInterviews: totalInterviewsCount
    },
    completedTopics: topicsList.slice(0, 3).map(t => t.id),
    streak: 3,
    xp: 450,
    achievements: [
      { id: "first-step", title: "First Step", description: "Successfully started your DevOps learning journey", unlocked: true },
      { id: "container-master", title: "Container Architect", description: "Completed all Docker modules", unlocked: false }
    ]
  };
};

// =========================================================================
// GLOBAL SEARCH
// =========================================================================

const searchGlobal = async (query) => {
  if (!query) return { topics: [], tools: [], projects: [], interviews: [], resources: [], notes: [] };
  const regex = new RegExp(query, 'i');
  
  if (dbConnected) {
    const topics = await Topic.find({ $or: [{ title: regex }, { summary: regex }] });
    const tools = await ToolGuide.find({ $or: [{ toolName: regex }, { name: regex }, { overview: regex }] });
    const projects = await Project.find({ $or: [{ title: regex }, { goal: regex }] });
    const interviews = await InterviewQuestion.find({ $or: [{ question: regex }, { answer: regex }] });
    const resources = await Resource.find({ $or: [{ title: regex }, { description: regex }, { category: regex }] });
    const notes = await Note.find({ $or: [{ title: regex }, { content: regex }, { category: regex }] });
    
    return {
      topics,
      tools,
      projects,
      interviews,
      resources,
      notes
    };
  }
  
  const q = query.toLowerCase();
  const topics = seedData.topics.filter(t => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q));
  const tools = seedData.tools.filter(t => (t.toolName || t.name).toLowerCase().includes(q) || t.overview.toLowerCase().includes(q));
  const projects = seedData.projects.filter(p => p.title.toLowerCase().includes(q) || p.goal.toLowerCase().includes(q));
  const interviews = seedData.interviewQuestions.filter(i => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q));
  const resources = seedData.resources.filter(r => r.title.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q)));
  const notes = seedData.notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  
  return {
    topics,
    tools,
    projects,
    interviews,
    resources,
    notes
  };
};

module.exports = {
  setDbStatus,
  getDbStatus,
  getTopics,
  getTopicById,
  getTopicsByCategory,
  searchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getTools,
  getToolByName,
  getToolsByCategory,
  createTool,
  updateTool,
  deleteTool,
  getResources,
  getResourceById,
  getResourcesByCategory,
  createResource,
  updateResource,
  deleteResource,
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getProjects,
  getProjectById,
  getProjectsByLevel,
  createProject,
  updateProject,
  deleteProject,
  getInterviewQuestions,
  getInterviewQuestionById,
  getInterviewQuestionsByTopic,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion,
  getCertifications,
  getDashboardData,
  searchGlobal
};
