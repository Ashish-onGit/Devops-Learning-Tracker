const dataService = require('../services/dataService');

exports.getInterviewQuestions = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const questions = await dataService.getInterviewQuestions(category, difficulty);
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    next(error);
  }
};

exports.getInterviewQuestionById = async (req, res, next) => {
  try {
    const question = await dataService.getInterviewQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Interview question not found' });
    }
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.getInterviewQuestionsByTopic = async (req, res, next) => {
  try {
    const questions = await dataService.getInterviewQuestionsByTopic(req.params.topic);
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    next(error);
  }
};

exports.createInterviewQuestion = async (req, res, next) => {
  try {
    const question = await dataService.createInterviewQuestion(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.updateInterviewQuestion = async (req, res, next) => {
  try {
    const question = await dataService.updateInterviewQuestion(req.params.id, req.body);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Interview question not found to update' });
    }
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

exports.deleteInterviewQuestion = async (req, res, next) => {
  try {
    const question = await dataService.deleteInterviewQuestion(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Interview question not found to delete' });
    }
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};
