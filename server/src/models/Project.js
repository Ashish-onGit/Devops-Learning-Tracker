const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Production'], required: true },
  goal: { type: String, required: true },
  architectureDescription: { type: String },
  steps: [String],
  expectedOutcome: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
