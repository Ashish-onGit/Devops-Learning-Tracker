const Topic = require('../models/Topic');
const TopicContent = require('../models/TopicContent');
const Quiz = require('../models/Quiz');
const InterviewQuestion = require('../models/InterviewQuestion');
const ToolGuide = require('../models/ToolGuide');
const Project = require('../models/Project');
const CertificationPath = require('../models/CertificationPath');
const seedData = require('../data/seedData');

let dbConnected = false;

const setDbStatus = (status) => {
  dbConnected = status;
};

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
    const content = await TopicContent.findOne({ topicId: id });
    const quiz = await Quiz.findOne({ topicId: id });
    return {
      ...topic.toObject(),
      content: content ? content.toObject() : null,
      quiz: quiz ? quiz.toObject() : null
    };
  }
  
  const topic = seedData.topics.find(t => t.id === id);
  if (!topic) return null;
  const content = seedData.topicContents.find(c => c.topicId === id);
  const quiz = seedData.quizzes.find(q => q.topicId === id);
  return {
    ...topic,
    content: content || null,
    quiz: quiz || null
  };
};

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

const getProjects = async () => {
  if (dbConnected) {
    return await Project.find({});
  }
  return seedData.projects;
};

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

const getCertifications = async () => {
  if (dbConnected) {
    return await CertificationPath.find({});
  }
  return seedData.certifications;
};

const searchGlobal = async (query) => {
  if (!query) return { topics: [], tools: [], projects: [], interviews: [] };
  const regex = new RegExp(query, 'i');
  
  if (dbConnected) {
    const topics = await Topic.find({ $or: [{ title: regex }, { summary: regex }] });
    const tools = await ToolGuide.find({ $or: [{ toolName: regex }, { overview: regex }] });
    const projects = await Project.find({ $or: [{ title: regex }, { goal: regex }] });
    const interviews = await InterviewQuestion.find({ $or: [{ question: regex }, { answer: regex }] });
    
    return {
      topics,
      tools,
      projects,
      interviews
    };
  }
  
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
};

module.exports = {
  setDbStatus,
  getTopics,
  getTopicById,
  getTools,
  getToolByName,
  getProjects,
  getInterviewQuestions,
  getCertifications,
  searchGlobal
};
