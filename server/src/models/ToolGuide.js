const mongoose = require('mongoose');

const ToolGuideSchema = new mongoose.Schema({
  toolName: { type: String, required: true, unique: true },
  name: { type: String }, // Alias/fallback field for toolName
  category: { type: String }, // e.g. Containers, Orchestration, CI/CD
  features: [{ type: String }], // List of features
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
