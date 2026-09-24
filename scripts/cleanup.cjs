const { request } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const folder = path.resolve('.runtime');
  const files = await fs.readdir(folder).catch((error) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  const context = await request.newContext({
    baseURL: 'https://automationexercise.com',
    timeout: 30000,
    proxy: process.env.PW_PROXY_SERVER ? { server: process.env.PW_PROXY_SERVER } : undefined,
  });
  let failed = 0;
  try {
    for (const file of files.filter((name) => /^qa-[a-f0-9]{32}\.json$/.test(name))) {
      try {
        const record = JSON.parse(await fs.readFile(path.join(folder, file), 'utf8'));
        if (
          !/^qa-[a-f0-9]{32}@example\.com$/.test(record.email) ||
          typeof record.password !== 'string'
        )
          throw new Error('Invalid recovery record');
        const send = async (method, endpoint) => {
          const response = await context.fetch(endpoint, {
            method,
            form: record,
            maxRedirects: 0,
            maxRetries: 0,
          });
          try {
            if (response.status() !== 200) throw new Error('Unexpected transport status');
            return await response.json();
          } finally {
            await response.dispose();
          }
        };
        let verification = await send('POST', '/api/verifyLogin');
        if (verification.responseCode === 200 && verification.message === 'User exists!') {
          const deletion = await send('DELETE', '/api/deleteAccount');
          if (deletion.responseCode !== 200 || deletion.message !== 'Account deleted!')
            throw new Error('Deletion failed');
          verification = await send('POST', '/api/verifyLogin');
        }
        if (verification.responseCode !== 404 || verification.message !== 'User not found!')
          throw new Error('Could not verify absence');
        await fs.unlink(path.join(folder, file));
        console.log('Recovered one synthetic assessment account.');
      } catch {
        failed++;
        console.error('Cleanup failed for one recovery record; it was kept for another attempt.');
      }
    }
  } finally {
    await context.dispose();
  }
  if (failed) process.exitCode = 1;
})();
