import { createSlice } from '@reduxjs/toolkit';

const loadInterviews = () => {
  const defaults = { completedQuestions: [], mockSessions: [] };
  try {
    const serialized = localStorage.getItem('devops_interviews_progress');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (e) {
    return defaults;
  }
};

const saveInterviews = (state) => {
  try {
    localStorage.setItem('devops_interviews_progress', JSON.stringify(state));
  } catch (e) {}
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState: loadInterviews(),
  reducers: {
    toggleQuestionCompleted: (state, action) => {
      const questionId = action.payload; // question identifier/text
      const index = state.completedQuestions.indexOf(questionId);
      if (index >= 0) {
        state.completedQuestions.splice(index, 1);
      } else {
        state.completedQuestions.push(questionId);
      }
      saveInterviews(state);
    },
    addMockSession: (state, action) => {
      const { category, score, totalQuestions, date } = action.payload;
      state.mockSessions.push({
        id: Math.random().toString(36).substring(2, 9),
        category,
        score,
        totalQuestions,
        date: date || new Date().toISOString()
      });
      saveInterviews(state);
    }
  }
});

export const { toggleQuestionCompleted, addMockSession } = interviewSlice.actions;
export default interviewSlice.reducer;
