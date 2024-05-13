const apiVersion = 1;

export const environment = {
  mock: false,
  production: true,
  version: 0.5,

  baseApiUrl: `https://dev.stardusttw.com/api/v${apiVersion}`,
  allowedDomains: ['dev.stardusttw.com'],

  tokenKey: 'aispeakin:token',
};
