const target = new URL(process.env.BASE_URL ?? 'https://automationexercise.com');

// Fail before sending synthetic credentials to an accidental target.
if (
  target.origin !== 'https://automationexercise.com' ||
  target.pathname !== '/' ||
  target.username ||
  target.password ||
  target.search ||
  target.hash
) {
  throw new Error('BASE_URL must be https://automationexercise.com for this assessment.');
}

const workers = Number(process.env.WORKERS ?? 1);
if (!Number.isInteger(workers) || workers < 1 || workers > 2) {
  throw new Error('WORKERS must be 1 or 2 for this shared practice service.');
}

export const environment = {
  baseURL: target.origin,
  workers,
  blockAds: process.env.BLOCK_ADS === '1',
  captureTrace: process.env.CAPTURE_TRACE === '1',
  proxy: process.env.PW_PROXY_SERVER ? { server: process.env.PW_PROXY_SERVER } : undefined,
};
