import axios from "axios";

const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export const getGithubProfileAPI = (username) => github.get(`/users/${username}`);

export const getGithubReposAPI = (username) =>
  github.get(`/users/${username}/repos?sort=updated&per_page=50`);

export const getRepoReadmeAPI = (username, repo) =>
  github.get(`/repos/${username}/${repo}/readme`);

export const getRepoLanguagesAPI = (username, repo) =>
  github.get(`/repos/${username}/${repo}/languages`);
