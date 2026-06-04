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
      const dayOfWeek = today.getDay();

      // Get YYYY-MM-DD local date string
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      // Update weekly activity chart log
      state.weeklyActivity[dayOfWeek] += 1;

      // Update streak
      if (!state.lastActiveDate) {
        state.streak = 1;
      } else {
        const lastActiveStr = state.lastActiveDate;
        
        if (todayStr !== lastActiveStr) {
          // Calculate difference in days between todayStr and lastActiveStr in local timezone
          const lastActiveDateObj = new Date(lastActiveStr + 'T00:00:00');
          const todayDateObj = new Date(todayStr + 'T00:00:00');
          const diffTime = todayDateObj.getTime() - lastActiveDateObj.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            state.streak += 1;
          } else if (diffDays > 1) {
            state.streak = 1; // reset streak
          }
          // If diffDays < 0 (system time turned back), do nothing
        }
        // If todayStr === lastActiveStr, do nothing (same day)
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
