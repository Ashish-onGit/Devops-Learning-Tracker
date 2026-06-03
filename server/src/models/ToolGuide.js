const mongoose = require('mongoose');

const ToolGuideSchema = new mongoose.Schema({
  toolName: { type: String, required: true, unique: true }, 
  overview: { type: String, required: true },
  installation: {
    linux: String,
    mac: String,
    windows: String
  },
  architecture: { type: String },
  commands: [{
    command: String,
    description: String
  }],
  examples: [{
    title: String,
    code: String,
    description: String
  }],
  useCases: [String],
  alternatives: [String],
  interviewQuestions: [{
    question: String,
    answer: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('ToolGuide', ToolGuideSchema);
