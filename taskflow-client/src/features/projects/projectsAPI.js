import api from "../../api/axios";

export const createProjectAPI = (payload) => api.post("/projects", payload);
export const getProjectsAPI = () => api.get("/projects");
export const updateProjectAPI = ({ id, data }) => api.patch(`/projects/${id}`, data);
export const deleteProjectAPI = (id) => api.delete(`/projects/${id}`);
