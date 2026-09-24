import { defineConfig, devices } from '@playwright/test';
import { environment } from './support/environment';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // An automatic rerun must not turn a real failure into an unexplained green build.
  retries: 0,
  workers: environment.workers,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: environment.baseURL,
    testIdAttribute: 'data-qa',
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
    ignoreHTTPSErrors: false,
    locale: 'en-GB',
    timezoneId: 'Asia/Kuala_Lumpur',
    proxy: environment.proxy,
    trace: environment.captureTrace ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'debugging',
      testDir: './tests/question-1-broken-automation-script',
      use: {
        ...devices['Desktop Chrome'],
        channel: process.env.PW_CHANNEL,
        launchOptions: { executablePath: process.env.PW_EXECUTABLE_PATH },
      },
    },
    {
      name: 'ui-chromium',
      testDir: './tests/question-2-automation-test',
      use: {
        ...devices['Desktop Chrome'],
        channel: process.env.PW_CHANNEL,
        launchOptions: { executablePath: process.env.PW_EXECUTABLE_PATH },
      },
    },
    { name: 'api', testDir: './tests/question-3-api-automation-test' },
    { name: 'framework-guards', testDir: './tests/framework-guards' },
    { name: 'security-api', testDir: './tests/security', testMatch: '**/*.api.spec.ts' },
    {
      name: 'security-ui',
      testDir: './tests/security',
      testMatch: '**/*.ui.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        channel: process.env.PW_CHANNEL,
        launchOptions: { executablePath: process.env.PW_EXECUTABLE_PATH },
      },
    },
    { name: 'performance', testDir: './tests/performance', timeout: 180_000 },
    {
      name: 'ui-firefox',
      testDir: './tests/question-2-automation-test',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'ui-webkit',
      testDir: './tests/question-2-automation-test',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
