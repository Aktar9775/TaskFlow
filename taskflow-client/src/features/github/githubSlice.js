import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getGithubProfileAPI,
  getGithubReposAPI,
  getRepoLanguagesAPI,
  getRepoReadmeAPI,
} from "./githubAPI";

export const fetchGithubProfile = createAsyncThunk(
  "github/profile",
  async (username, thunkAPI) => {
    try {
      const res = await getGithubProfileAPI(username);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Invalid GitHub username");
    }
  }
);

export const fetchGithubRepos = createAsyncThunk(
  "github/repos",
  async (username, thunkAPI) => {
    try {
      const res = await getGithubReposAPI(username);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Cannot fetch repositories");
    }
  }
);

export const fetchRepoDetails = createAsyncThunk(
  "github/repoDetails",
  async ({ username, repo }, thunkAPI) => {
    try {
      const [readmeRes, langRes] = await Promise.all([
        getRepoReadmeAPI(username, repo),
        getRepoLanguagesAPI(username, repo),
      ]);

      const readmeBase64 = readmeRes.data.content || "";
      const readme = atob(readmeBase64.replace(/\n/g, ""));

      return {
        repo,
        readme,
        languages: Object.keys(langRes.data),
      };
    } catch (err) {
      return thunkAPI.rejectWithValue("Unable to fetch repo details");
    }
  }
);

const githubSlice = createSlice({
  name: "github",
  initialState: {
    username: "", // ✅ don't load from global key
    profile: null,
    repos: [],
    selectedRepo: null,
    repoDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    /**
     * ✅ Save github username per-user
     * payload: { userId, username }
     */
    setGithubUsername: (state, action) => {
      const { userId, username } = action.payload;

      state.username = username; // ✅ store only string in redux
      localStorage.setItem(`githubUsername_${userId}`, username);
    },

    /**
     * ✅ Load username per-user from storage when user login
     * payload: userId
     */
    loadGithubUsername: (state, action) => {
      const userId = action.payload;
      const saved = localStorage.getItem(`githubUsername_${userId}`) || "";
      state.username = saved;
    },

    /**
     * ✅ unlink github only if user clicks unlink
     * payload: userId
     */
    unlinkGithub: (state, action) => {
      const userId = action.payload;

      state.username = "";
      state.profile = null;
      state.repos = [];
      state.selectedRepo = null;
      state.repoDetails = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem(`githubUsername_${userId}`);
    },

    /**
     * ✅ Reset redux on logout, BUT keep localStorage
     */
    resetGithubState: (state) => {
      state.username = "";
      state.profile = null;
      state.repos = [];
      state.selectedRepo = null;
      state.repoDetails = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchGithubProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGithubProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchGithubProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
      })

      .addCase(fetchRepoDetails.pending, (state) => {
        state.repoDetails = null;
        state.error = null;
      })
      .addCase(fetchRepoDetails.fulfilled, (state, action) => {
        state.repoDetails = action.payload;
      })
      .addCase(fetchRepoDetails.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setGithubUsername,
  loadGithubUsername,
  unlinkGithub,
  resetGithubState,
} = githubSlice.actions;

export default githubSlice.reducer;
