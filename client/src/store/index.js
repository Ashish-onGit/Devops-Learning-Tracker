import { configureStore } from '@reduxjs/toolkit';
import roadmapReducer from './slices/roadmapSlice';
import dashboardReducer from './slices/dashboardSlice';
import notesReducer from './slices/notesSlice';
import resourcesReducer from './slices/resourcesSlice';
import projectsReducer from './slices/projectsSlice';
import interviewReducer from './slices/interviewSlice';
import progressReducer from './slices/progressSlice';
import bookmarksReducer from './slices/bookmarksSlice';
import settingsReducer from './slices/settingsSlice';
import certificationsReducer from './slices/certificationsSlice';

export const store = configureStore({
  reducer: {
    roadmap: roadmapReducer,
    dashboard: dashboardReducer,
    notes: notesReducer,
    resources: resourcesReducer,
    projects: projectsReducer,
    interview: interviewReducer,
    progress: progressReducer,
    bookmarks: bookmarksReducer,
    settings: settingsReducer,
    certifications: certificationsReducer
  }
});

export default store;
