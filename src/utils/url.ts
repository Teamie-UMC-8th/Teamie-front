export const getHomeUrl = (path = '') => `/home${path ? `/${path}` : ''}`;

export const getProjectUrl = (projectId: string, path = '') =>
  `/projects/${projectId}${path ? `/${path}` : ''}`;
