const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true }, // Foundation, Containers, Orchestration, CI/CD, IaC, Cloud, Monitoring, Security, GitOps, ServiceMesh, Advanced
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  prerequisites: [{ type: String }],
  summary: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Topic', TopicSchema);
