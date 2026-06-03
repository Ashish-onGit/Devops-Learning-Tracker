const dataService = require('../services/dataService');

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await dataService.getTopics();
    res.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    next(error);
  }
};

exports.getTopicById = async (req, res, next) => {
  try {
    const topic = await dataService.getTopicById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};
