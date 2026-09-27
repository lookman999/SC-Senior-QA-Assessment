const baseURL = process.env.BASE_URL ?? 'https://automationexercise.com';
if (baseURL !== 'https://automationexercise.com') {
  throw new Error('BASE_URL must be https://automationexercise.com for this assessment.');
}
export const environment = {
  baseURL,
  proxy: process.env.PW_PROXY_SERVER ? { server: process.env.PW_PROXY_SERVER } : undefined,
};
