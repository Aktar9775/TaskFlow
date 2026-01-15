import api from "../../api/axios";

export const createTaskAPI = (payload) => api.post("/tasks", payload);
export const getTasksAPI = (projectId) => api.get(`/tasks?projectId=${projectId}`);
export const updateTaskAPI = ({ id, data }) => api.patch(`/tasks/${id}`, data);
export const deleteTaskAPI = (id) => api.delete(`/tasks/${id}`);
