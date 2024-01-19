// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseUrl = 'http://172.16.0.210';
const backendPort = 3001;

export const environment = {
  production: true,
  name: 'local',
  apiUrl: `${baseUrl}:${backendPort}`,
  socketUrl: `${baseUrl}:${backendPort}`,
  webPushPublicKey: 'BIIuxA2Hv0Ol-XFXQe4Wkqtc7sP83dqxb2eECPj3zKpyc3kCXfNwg0ObiG5U4xNzlrw5DaKwC9reOL1G1NurXk8'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
