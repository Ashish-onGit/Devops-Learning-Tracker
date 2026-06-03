import { createSlice } from '@reduxjs/toolkit';

const resourcesSlice = createSlice({
  name: 'resources',
  initialState: {
    articles: [],
    repos: [],
    loading: false,
    error: null,
    activeTab: 'all' // all, articles, repos, docs
  },
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    setRepos: (state, action) => {
      state.repos = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    }
  }
});

export const { setArticles, setRepos, setLoading, setError, setActiveTab } = resourcesSlice.actions;
export default resourcesSlice.reducer;
