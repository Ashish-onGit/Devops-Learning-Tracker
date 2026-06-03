const dataService = require('../services/dataService');

exports.getTools = async (req, res, next) => {
  try {
    const tools = await dataService.getTools();
    res.json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    next(error);
  }
};

exports.getToolByName = async (req, res, next) => {
  try {
    const tool = await dataService.getToolByName(req.params.name);
    if (!tool) {
      return res.status(404).json({ success: false, error: 'Tool not found' });
    }
    res.json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};
