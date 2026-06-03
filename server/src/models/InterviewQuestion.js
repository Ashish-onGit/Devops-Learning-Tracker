const mongoose = require('mongoose');

const InterviewQuestionSchema = new mongoose.Schema({
  category: { type: String, required: true }, 
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  scenarioBased: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('InterviewQuestion', InterviewQuestionSchema);
