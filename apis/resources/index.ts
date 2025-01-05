import { getGithubAccessToken, refreshGithubAccessToken } from "./github";

export const resourcesApi = {
  github: {
    getAccessToken: getGithubAccessToken,
    refreshAccessToken: refreshGithubAccessToken,
  },
};
