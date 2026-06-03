import { createSlice } from '@reduxjs/toolkit';

const loadProgress = () => {
  const defaults = { completedTopics: {} };
  try {
    const serialized = localStorage.getItem('devops_progress');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (e) {
    return defaults;
  }
};

const saveProgress = (state) => {
  try {
    localStorage.setItem('devops_progress', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
};

const progressSlice = createSlice({
  name: 'progress',
  initialState: loadProgress(),
  reducers: {
    completeTopic: (state, action) => {
      const { topicId, quizPassed, score } = action.payload;
      const existing = state.completedTopics[topicId] || {};
      
      state.completedTopics[topicId] = {
        ...existing,
        completed: true,
        completedAt: new Date().toISOString(),
        quizPassed: quizPassed !== undefined ? quizPassed : existing.quizPassed || false,
        score: score !== undefined ? score : existing.score || 0
      };
      saveProgress(state);
    },
    updateQuizScore: (state, action) => {
      const { topicId, quizPassed, score } = action.payload;
      const existing = state.completedTopics[topicId] || {};
      
      state.completedTopics[topicId] = {
        ...existing,
        quizPassed,
        score,
        quizAttemptedAt: new Date().toISOString()
      };
      saveProgress(state);
    },
    resetProgress: (state) => {
      state.completedTopics = {};
      saveProgress(state);
    }
  }
});

export const { completeTopic, updateQuizScore, resetProgress } = progressSlice.actions;
export default progressSlice.reducer;
