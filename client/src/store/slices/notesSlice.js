import { createSlice } from '@reduxjs/toolkit';

const loadNotes = () => {
  const defaults = { notes: [] };
  try {
    const serialized = localStorage.getItem('devops_notes');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (e) {
    return defaults;
  }
};

const saveNotes = (state) => {
  try {
    localStorage.setItem('devops_notes', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save notes to localStorage', e);
  }
};

const notesSlice = createSlice({
  name: 'notes',
  initialState: loadNotes(),
  reducers: {
    addNote: (state, action) => {
      state.notes.push({
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...action.payload
      });
      saveNotes(state);
    },
    updateNote: (state, action) => {
      const { id, title, content, category, tags } = action.payload;
      const note = state.notes.find(n => n.id === id);
      if (note) {
        note.title = title !== undefined ? title : note.title;
        note.content = content !== undefined ? content : note.content;
        note.category = category !== undefined ? category : note.category;
        note.tags = tags !== undefined ? tags : note.tags;
        note.updatedAt = new Date().toISOString();
      }
      saveNotes(state);
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(n => n.id !== action.payload);
      saveNotes(state);
    }
  }
});

export const { addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
