import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAPI, registerAPI } from "./authAPI";

// ✅ Login action
export const login = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const res = await loginAPI(payload);
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

// ✅ Register action
export const register = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      const res = await registerAPI(payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Register failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    isAuth: !!localStorage.getItem("accessToken"),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      state.user = null;
      state.isAuth = false;
    },

    // ✅ For future profile update (name change)
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);

        // ✅ Ensure user contains name
        const userData = {
          ...action.payload.user,
          name:
            action.payload.user?.name ||
            action.payload.user?.fullName ||
            action.payload.user?.username ||
            "User",
        };

        // ✅ Save full user details in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        state.user = userData;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
