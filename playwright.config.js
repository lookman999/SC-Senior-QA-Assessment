import { defineConfig, devices } from '@playwright/test';
import { environment } from './config/environment.js';
export default defineConfig({
  testDir: './tests',
  workers: 1,
  retries: 0,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['allure-playwright', { detail: false }]],
  use: {
    baseURL: environment.baseURL,
    testIdAttribute: 'data-qa',
    headless: process.env.PW_DEMO !== '1' && Boolean(process.env.CI),
    channel: process.env.PW_CHANNEL,
    launchOptions: { slowMo: process.env.PW_DEMO === '1' ? 1000 : 0 },
    proxy: environment.proxy,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/question-2-automation-test',
      use: { ...devices['Desktop Chrome'] },
    },
    { name: 'api', testDir: './tests/question-3-api-automation-test' },
  ],
});
