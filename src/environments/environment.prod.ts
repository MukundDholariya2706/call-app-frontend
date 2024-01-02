const baseUrl = 'https://call-app-backend.vercel.app/';
const backendPort = '';

export const environment = {
  production: true,
  apiUrl: `${baseUrl}:${backendPort}`,
  socketUrl: `${baseUrl}:${backendPort}`,
};
