import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../utils/api";

export interface Task {
  id: number;
  title: string;
  description: string;
  stage: string;
  category: string | null;
  created_at: string;
  completion_date: string;
}

interface TasksResponse {
  results: Task[];
  count: number;
}

interface TasksState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  totalPages: number;
  totalCount: number;
}

const initialState: TasksState = {
  tasks: [],
  status: "idle",
  totalPages: 1,
  totalCount: 0,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (page: number) => {
    const response = await api.get<TasksResponse>(`/tasks/?page=${page}`);
    return {
      tasks: response.results,
      totalPages: Math.ceil(response.count / 15),
      totalCount: response.count,
    };
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({ title, description }: { title: string; description: string }) => {
    const response = await api.post<
      Task,
      { title: string; description: string }
    >("/tasks/", { title, description });
    return response;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (updatedTask: Task) => {
    const response = await api.put<Task, Task>(
      `/tasks/${updatedTask.id}/`,
      updatedTask
    );
    return response;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: number) => {
    await api.delete<void>(`/tasks/${taskId}/`);
    return taskId;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTasks.fulfilled,
        (
          state,
          action: PayloadAction<{
            tasks: Task[];
            totalPages: number;
            totalCount: number;
          }>
        ) => {
          state.status = "succeeded";
          state.tasks = action.payload.tasks;
          state.totalPages = action.payload.totalPages;
          state.totalCount = action.payload.totalCount;
        }
      )
      .addCase(fetchTasks.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
