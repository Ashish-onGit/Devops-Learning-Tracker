const dataService = require('../services/dataService');

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await dataService.getProjects();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};
