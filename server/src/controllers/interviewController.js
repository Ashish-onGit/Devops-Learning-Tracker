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
