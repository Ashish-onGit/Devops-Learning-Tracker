const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  topicId: { type: String, required: true, unique: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
