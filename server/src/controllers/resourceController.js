const dataService = require('../services/dataService');

exports.getResources = async (req, res, next) => {
  try {
    const { type } = req.query;
    const resources = await dataService.getResources(type);
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await dataService.getResourceById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.getResourcesByCategory = async (req, res, next) => {
  try {
    const resources = await dataService.getResourcesByCategory(req.params.category);
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const resource = await dataService.createResource(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await dataService.updateResource(req.params.id, req.body);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found to update' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await dataService.deleteResource(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found to delete' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};
