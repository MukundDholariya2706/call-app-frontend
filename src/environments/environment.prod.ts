const baseUrl = 'http://localhost';
const backendPort = 3001;

export const environment = {
  production: true,
  apiUrl: `${baseUrl}:${backendPort}`,
  socketUrl: `${baseUrl}:${backendPort}`,
};
