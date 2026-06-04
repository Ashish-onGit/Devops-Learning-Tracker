const express = require('express');
const router = express.Router();

const topicController = require('../controllers/topicController');
const toolController = require('../controllers/toolController');
const projectController = require('../controllers/projectController');
const interviewController = require('../controllers/interviewController');
const certificationController = require('../controllers/certificationController');
const searchController = require('../controllers/searchController');
const aiController = require('../controllers/aiController');
const noteController = require('../controllers/noteController');
const resourceController = require('../controllers/resourceController');
const dashboardController = require('../controllers/dashboardController');
const dataService = require('../services/dataService');

// Health Check
router.get('/health', (req, res) => {
  const isDbConnected = dataService.getDbStatus();
  res.json({
    success: true,
    status: 'healthy',
    database: isDbConnected ? 'connected' : 'fallback',
    timestamp: new Date()
  });
});

// AI Assistant
router.post('/ai/chat', aiController.chat);

// Topics
router.get('/topics', topicController.getTopics);
router.get('/topics/search', topicController.searchTopics);
router.get('/topics/category/:category', topicController.getTopicsByCategory);
router.get('/topics/:id', topicController.getTopicById);
router.post('/topics', topicController.createTopic);
router.put('/topics/:id', topicController.updateTopic);
router.delete('/topics/:id', topicController.deleteTopic);

// Tools
router.get('/tools', toolController.getTools);
router.get('/tools/category/:category', toolController.getToolsByCategory);
router.get('/tools/:name', toolController.getToolByName);
router.post('/tools', toolController.createTool);
router.put('/tools/:id', toolController.updateTool);
router.delete('/tools/:id', toolController.deleteTool);

// Resources
router.get('/resources', resourceController.getResources);
router.get('/resources/category/:category', resourceController.getResourcesByCategory);
router.get('/resources/:id', resourceController.getResourceById);
router.post('/resources', resourceController.createResource);
router.put('/resources/:id', resourceController.updateResource);
router.delete('/resources/:id', resourceController.deleteResource);

// Projects
router.get('/projects', projectController.getProjects);
router.get('/projects/level/:level', projectController.getProjectsByLevel);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Notes
router.get('/notes', noteController.getNotes);
router.get('/notes/search', noteController.searchNotes);
router.get('/notes/:id', noteController.getNoteById);
router.post('/notes', noteController.createNote);
router.put('/notes/:id', noteController.updateNote);
router.delete('/notes/:id', noteController.deleteNote);

// Interview Questions
router.get('/interview-questions', interviewController.getInterviewQuestions);
router.get('/interview-questions/topic/:topic', interviewController.getInterviewQuestionsByTopic);
router.get('/interview-questions/:id', interviewController.getInterviewQuestionById);
router.post('/interview-questions', interviewController.createInterviewQuestion);
router.put('/interview-questions/:id', interviewController.updateInterviewQuestion);
router.delete('/interview-questions/:id', interviewController.deleteInterviewQuestion);

// Interviews Alias (for backward compatibility with old frontend calls)
router.get('/interviews', interviewController.getInterviewQuestions);

// Certifications
router.get('/certifications', certificationController.getCertifications);

// Dashboard
router.get('/dashboard', dashboardController.getDashboardData);

// Search
router.get('/search', searchController.search);

module.exports = router;
