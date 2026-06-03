const mongoose = require('mongoose');

const TopicContentSchema = new mongoose.Schema({
  topicId: { type: String, required: true, unique: true },
  overview: { type: String, required: true },
  theory: { type: String, required: true },
  visualExplanation: { type: String }, 
  realWorldExample: { type: String },
  commands: [{
    command: String,
    description: String
  }],
  bestPractices: [String],
  commonMistakes: [String],
  labs: [{
    title: String,
    steps: [String]
  }],
  miniProject: {
    title: String,
    description: String,
    steps: [String],
    solution: String
  }
}, { timestamps: true });

module.exports = mongoose.model('TopicContent', TopicContentSchema);
