const apiVersion = 1;

export const environment = {
  mock: false,
  production: true,
  version: '0.12',

  wsUrl: 'wss://_s7.stt.ubestream.com/wssapi_s7/',

  baseApiUrl: `https://dev.stardusttw.com/api/v${apiVersion}`,
  allowedDomains: ['dev.stardusttw.com'],

  tokenKey: 'aispeakin:token',
};
