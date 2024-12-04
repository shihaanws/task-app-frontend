import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASEURL;

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + "/api/auth/login", formData);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      return response.data.token;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Login failed");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + "/api/auth/signup", formData);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("success");

      return response.data.token;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Signup failed");
    }
  }
);

export const userDetail = createAsyncThunk(
  "auth/user",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.get(baseUrl + "/api/auth/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "User Details not found"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("token")
      ? jwtDecode(localStorage.getItem("token"))
      : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.user = jwtDecode(action.payload);
        localStorage.setItem("token", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
