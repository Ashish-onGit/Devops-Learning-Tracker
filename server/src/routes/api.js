const express = require('express');
const router = express.Router();

const topicController = require('../controllers/topicController');
const toolController = require('../controllers/toolController');
const projectController = require('../controllers/projectController');
const interviewController = require('../controllers/interviewController');
const certificationController = require('../controllers/certificationController');
const searchController = require('../controllers/searchController');
const aiController = require('../controllers/aiController');

// Health Check
router.get('/health', (req, res) => res.json({ success: true, status: 'healthy', timestamp: new Date() }));

// AI Assistant
router.post('/ai/chat', aiController.chat);

// Topics
router.get('/topics', topicController.getTopics);
router.get('/topics/:id', topicController.getTopicById);

// Tools
router.get('/tools', toolController.getTools);
router.get('/tools/:name', toolController.getToolByName);

// Projects
router.get('/projects', projectController.getProjects);

// Interviews
router.get('/interviews', interviewController.getInterviewQuestions);

// Certifications
router.get('/certifications', certificationController.getCertifications);

// Search
router.get('/search', searchController.search);

module.exports = router;
