const dataService = require('../services/dataService');

exports.getDashboardData = async (req, res, next) => {
  try {
    const data = await dataService.getDashboardData();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
