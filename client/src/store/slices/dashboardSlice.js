import { createSlice } from '@reduxjs/toolkit';

const loadDashboardState = () => {
  const defaults = {
    streak: 0,
    timeSpent: 0, // in minutes
    lastActiveDate: null,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0]
  };
  try {
    const serialized = localStorage.getItem('devops_dashboard');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (e) {
    return defaults;
  }
};

const saveDashboardState = (state) => {
  try {
    localStorage.setItem('devops_dashboard', JSON.stringify(state));
  } catch (e) {}
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: loadDashboardState(),
  reducers: {
    recordActivity: (state) => {
      const today = new Date();
      const todayStr = today.toDateString();
      const dayOfWeek = today.getDay();

      // Update weekly activity chart log
      state.weeklyActivity[dayOfWeek] += 1;

      // Update streak
      if (!state.lastActiveDate) {
        state.streak = 1;
      } else {
        const lastActive = new Date(state.lastActiveDate);
        const diffTime = Math.abs(today - lastActive);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          state.streak += 1;
        } else if (diffDays > 1 && todayStr !== lastActive.toDateString()) {
          state.streak = 1; // reset streak
        }
      }
      state.lastActiveDate = todayStr;
      saveDashboardState(state);
    },
    incrementTimeSpent: (state, action) => {
      const minutes = action.payload || 1;
      state.timeSpent += minutes;
      saveDashboardState(state);
    }
  }
});

export const { recordActivity, incrementTimeSpent } = dashboardSlice.actions;
export default dashboardSlice.reducer;
