const dataService = require('../services/dataService');

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await dataService.getProjects();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await dataService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.getProjectsByLevel = async (req, res, next) => {
  try {
    const projects = await dataService.getProjectsByLevel(req.params.level);
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await dataService.createProject(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await dataService.updateProject(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found to update' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await dataService.deleteProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found to delete' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
