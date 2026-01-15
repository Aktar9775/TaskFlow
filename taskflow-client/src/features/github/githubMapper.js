export const mapGithubRepoToProject = (repo) => ({
  _id: `github-${repo.id}`,            // unique for UI
  name: repo.name,
  description: repo.description || "",
  status: repo.archived ? "ARCHIVED" : "ACTIVE",
  source: "GITHUB",
  repoUrl: repo.html_url,
  homepage: repo.homepage,
  updatedAt: repo.updated_at,
  stars: repo.stargazers_count,
  forks: repo.forks_count,
});


