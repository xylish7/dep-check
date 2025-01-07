import { getUpdates } from "./dependecies";
import { getGithubRepos, getIsGithubAuthorized } from "./github";

export const serverApi = {
  github: {
    auth: { isAuthorized: getIsGithubAuthorized },
    repos: {
      get: getGithubRepos,
    },
  },
  dependencies: {
    get: getUpdates,
  },
};
