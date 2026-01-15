import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/projects/projectsSlice";
import taskReducer from "../features/tasks/taskSlice";
import githubReducer from "../features/github/githubSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    github: githubReducer,
  },
});
