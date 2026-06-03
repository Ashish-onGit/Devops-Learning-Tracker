import { createSlice } from '@reduxjs/toolkit';

const loadBookmarks = () => {
  const defaults = { topics: [], tools: [], questions: [], projects: [] };
  try {
    const serialized = localStorage.getItem('devops_bookmarks');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (e) {
    return defaults;
  }
};

const saveBookmarks = (state) => {
  try {
    localStorage.setItem('devops_bookmarks', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save bookmarks to localStorage', e);
  }
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: loadBookmarks(),
  reducers: {
    toggleBookmark: (state, action) => {
      const { type, id } = action.payload; // type can be 'topics', 'tools', 'questions', 'projects'
      if (state[type]) {
        const index = state[type].indexOf(id);
        if (index >= 0) {
          state[type].splice(index, 1);
        } else {
          state[type].push(id);
        }
        saveBookmarks(state);
      }
    }
  }
});

export const { toggleBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
