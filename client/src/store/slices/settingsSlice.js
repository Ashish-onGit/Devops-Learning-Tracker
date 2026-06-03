import { createSlice } from '@reduxjs/toolkit';

const loadSettings = () => {
  try {
    const serialized = localStorage.getItem('devops_settings');
    if (serialized) return JSON.parse(serialized);
  } catch (e) {}
  
  // Default values
  const hasDarkClass = document.documentElement.classList.contains('dark');
  return {
    theme: hasDarkClass ? 'dark' : 'light',
    notificationsEnabled: true
  };
};

const saveSettings = (state) => {
  try {
    localStorage.setItem('devops_settings', JSON.stringify(state));
  } catch (e) {}
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettings(),
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      
      // Update DOM class accordingly
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      saveSettings(state);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      saveSettings(state);
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
      saveSettings(state);
    }
  }
});

export const { toggleTheme, setTheme, toggleNotifications } = settingsSlice.actions;
export default settingsSlice.reducer;
