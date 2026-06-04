const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['repo', 'article', 'docs'], required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  owner: { type: String }, // For repositories
  stars: { type: String }, // For repositories
  forks: { type: String }, // For repositories
  author: { type: String }, // For articles
  source: { type: String }, // For articles
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  readTime: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
