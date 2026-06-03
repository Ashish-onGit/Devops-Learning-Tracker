const aiService = require('../services/aiService');

exports.chat = async (req, res, next) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    const reply = await aiService.generateChatResponse(prompt, context);
    res.json({ success: true, data: reply });
  } catch (error) {
    next(error);
  }
};
