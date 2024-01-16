// const baseUrl = 'https://call-app-backend.vercel.app';
const baseUrl = 'http://54.221.76.170';
const backendPort = '3001';

export const environment = {
  production: true,
  apiUrl: `${baseUrl}:${backendPort}`,
  socketUrl: `${baseUrl}:${backendPort}`,
};
