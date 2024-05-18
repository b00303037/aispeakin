// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const apiVersion = 1;

export const environment = {
  mock: false,
  production: false,
  version: 0,

  wsUrl: 'wss://stt.ubestream.com/wssapi/',

  /* FOR LOCAL API */
  // baseApiUrl: `https://localhost:44312/api/v${apiVersion}`,
  // allowedDomains: ['localhost:44312'],
  /* FOR DEV API */
  baseApiUrl: `/api/v${apiVersion}`,
  allowedDomains: ['/api'],

  tokenKey: 'dev:aispeakin:token',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
