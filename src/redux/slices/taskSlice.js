import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASEURL;

// Fetch all tasks (for admin or user-specific)
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (userId, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const endpoint = userId
        ? baseUrl + `/api/tasks?userId=${userId}`
        : baseUrl + "/api/tasks";
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.post(baseUrl + "/api/tasks", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.put(baseUrl + `/api/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      await axios.delete(baseUrl + `/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index >= 0) state.tasks[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
