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

exports.getTopicsByCategory = async (req, res, next) => {
  try {
    const topics = await dataService.getTopicsByCategory(req.params.category);
    res.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    next(error);
  }
};

exports.searchTopics = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await dataService.searchTopics(q);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

exports.createTopic = async (req, res, next) => {
  try {
    const topic = await dataService.createTopic(req.body);
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

exports.updateTopic = async (req, res, next) => {
  try {
    const topic = await dataService.updateTopic(req.params.id, req.body);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found to update' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await dataService.deleteTopic(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found to delete' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};
