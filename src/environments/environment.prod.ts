// const baseUrl = 'https://call-app-backend.vercel.app';
const baseUrl = 'http://172.16.0.210';
const backendPort = 3001;

export const environment = {
  production: true,
  name: 'prod',
  apiUrl: `${baseUrl}:${backendPort}`,
  socketUrl: `${baseUrl}:${backendPort}`,
  webPushPublicKey: 'BIIuxA2Hv0Ol-XFXQe4Wkqtc7sP83dqxb2eECPj3zKpyc3kCXfNwg0ObiG5U4xNzlrw5DaKwC9reOL1G1NurXk8'
};
