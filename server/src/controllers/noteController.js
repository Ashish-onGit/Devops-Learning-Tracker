const dataService = require('../services/dataService');

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await dataService.getNotes();
    res.json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await dataService.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const note = await dataService.createNote(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await dataService.updateNote(req.params.id, req.body);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found to update' });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await dataService.deleteNote(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found to delete' });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

exports.searchNotes = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await dataService.searchNotes(q);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
