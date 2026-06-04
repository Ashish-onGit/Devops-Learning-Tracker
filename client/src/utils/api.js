import axios from 'axios';
import { seedData } from './seedData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${API_BASE_URL}/api/v1`;

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

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
      const content = seedData.topicContents.find(c => c.topicId === id);
      const quiz = seedData.quizzes.find(q => q.topicId === id);
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
