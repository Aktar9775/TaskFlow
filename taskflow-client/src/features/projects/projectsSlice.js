import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProjectAPI,
  deleteProjectAPI,
  getProjectsAPI,
  updateProjectAPI,
} from "./projectsAPI";

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await getProjectsAPI();
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload, thunkAPI) => {
    try {
      const res = await createProjectAPI(payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateProjectAPI({ id, data });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, thunkAPI) => {
    try {
      await deleteProjectAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // update
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export default projectSlice.reducer;
