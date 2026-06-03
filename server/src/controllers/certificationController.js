const dataService = require('../services/dataService');

exports.getCertifications = async (req, res, next) => {
  try {
    const certs = await dataService.getCertifications();
    res.json({ success: true, count: certs.length, data: certs });
  } catch (error) {
    next(error);
  }
};
