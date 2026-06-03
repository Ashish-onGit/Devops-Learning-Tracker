const dataService = require('../services/dataService');

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await dataService.searchGlobal(q);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
