import { defineConfig, devices } from '@playwright/test';
import { environment } from './support/environment.js';
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
    headless: Boolean(process.env.CI),
    channel: process.env.PW_CHANNEL,
    launchOptions: { slowMo: process.env.CI ? 0 : 400 },
    proxy: environment.proxy,
    screenshot: 'only-on-failure',
    trace: 'off',
  },
  projects: [
    {
      name: 'q1',
      testDir: './tests/question-1-broken-automation-script',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui',
      testDir: './tests/question-2-automation-test',
      use: { ...devices['Desktop Chrome'] },
    },
    { name: 'api', testDir: './tests/question-3-api-automation-test' },
  ],
});
