import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createTaskAPI, deleteTaskAPI, getTasksAPI, updateTaskAPI } from "./taskAPI";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (projectId, thunkAPI) => {
  try {
    const res = await getTasksAPI(projectId);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch tasks failed");
  }
});

export const createTask = createAsyncThunk("tasks/create", async (payload, thunkAPI) => {
  try {
    const res = await createTaskAPI(payload);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Create task failed");
  }
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await updateTaskAPI({ id, data });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Update task failed");
  }
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id, thunkAPI) => {
  try {
    await deleteTaskAPI(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Delete task failed");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedProjectId: "",
  },
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProjectId = action.payload;
    },
    clearTasks: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // update
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.list.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export const { setSelectedProject, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
