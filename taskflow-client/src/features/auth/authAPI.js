import api from "../../api/axios";

export const registerAPI = (payload) => api.post("/auth/register", payload);
export const loginAPI = (payload) => api.post("/auth/login", payload);

export const logoutAPI = (payload) => api.post("/auth/logout", payload); // userId
