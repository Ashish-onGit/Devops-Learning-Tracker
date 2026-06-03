import { createSlice } from '@reduxjs/toolkit';

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState: {
    topics: [],
    loading: false,
    error: null,
    activeTopicId: null,
    searchQuery: '',
    expandedCategories: {
      'Foundation': true,
      'Containers': true,
      'Orchestration': true
    }
  },
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveTopicId: (state, action) => {
      state.activeTopicId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleCategoryExpanded: (state, action) => {
      const category = action.payload;
      state.expandedCategories[category] = !state.expandedCategories[category];
    }
  }
});

export const {
  setTopics,
  setLoading,
  setError,
  setActiveTopicId,
  setSearchQuery,
  toggleCategoryExpanded
} = roadmapSlice.actions;
export default roadmapSlice.reducer;
