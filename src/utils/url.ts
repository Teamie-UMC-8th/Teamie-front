export const getHomeUrl = (path = '') => `/home${path ? `/${path}` : ''}`;

export const getProjectUrl = (projectId: string, path = '') =>
  `/projects/${projectId}${path ? `/${path}` : ''}`;

export const getTeamTaskUrl = (projectId: string, planId: string) =>
  `/projects/${projectId}/teamCalendar/${planId}/teamTask`;
