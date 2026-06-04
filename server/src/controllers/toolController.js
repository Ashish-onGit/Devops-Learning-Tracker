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

exports.getToolsByCategory = async (req, res, next) => {
  try {
    const tools = await dataService.getToolsByCategory(req.params.category);
    res.json({ success: true, count: tools.length, data: tools });
  } catch (error) {
    next(error);
  }
};

exports.createTool = async (req, res, next) => {
  try {
    const tool = await dataService.createTool(req.body);
    res.status(201).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};

exports.updateTool = async (req, res, next) => {
  try {
    const tool = await dataService.updateTool(req.params.id, req.body);
    if (!tool) {
      return res.status(404).json({ success: false, error: 'Tool not found to update' });
    }
    res.json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};

exports.deleteTool = async (req, res, next) => {
  try {
    const tool = await dataService.deleteTool(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, error: 'Tool not found to delete' });
    }
    res.json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};
