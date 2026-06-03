import { createSlice } from '@reduxjs/toolkit';

const loadProjects = () => {
  const defaults = { completedSteps: {}, completedProjects: [] };
  try {
    const serialized = localStorage.getItem('devops_projects_progress');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (e) {
    return defaults;
  }
};

const saveProjects = (state) => {
  try {
    localStorage.setItem('devops_projects_progress', JSON.stringify(state));
  } catch (e) {}
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState: loadProjects(),
  reducers: {
    toggleProjectStep: (state, action) => {
      const { projectTitle, stepIndex } = action.payload;
      if (!state.completedSteps[projectTitle]) {
        state.completedSteps[projectTitle] = [];
      }
      const steps = state.completedSteps[projectTitle];
      const index = steps.indexOf(stepIndex);
      if (index >= 0) {
        steps.splice(index, 1);
      } else {
        steps.push(stepIndex);
      }
      saveProjects(state);
    },
    markProjectCompleted: (state, action) => {
      const projectTitle = action.payload;
      if (!state.completedProjects.includes(projectTitle)) {
        state.completedProjects.push(projectTitle);
      }
      saveProjects(state);
    },
    toggleProjectCompleted: (state, action) => {
      const projectTitle = action.payload;
      const index = state.completedProjects.indexOf(projectTitle);
      if (index >= 0) {
        state.completedProjects.splice(index, 1);
      } else {
        state.completedProjects.push(projectTitle);
      }
      saveProjects(state);
    }
  }
});

export const { toggleProjectStep, markProjectCompleted, toggleProjectCompleted } = projectsSlice.actions;
export default projectsSlice.reducer;
