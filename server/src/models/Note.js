const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Learning Notes' },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
