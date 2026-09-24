import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

// Template for an owned staging environment exposing the same catalog contract.
const target = (__ENV.PERF_BASE_URL || '').replace(/\/$/, '');
if (__ENV.ALLOW_LOAD !== '1' || !/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(target)) {
  throw new Error('Set ALLOW_LOAD=1 and an authorized HTTPS staging origin in PERF_BASE_URL.');
}
if (/^https:\/\/(?:[^/]+\.)?automationexercise\.com(?::\d+)?$/i.test(target)) {
  throw new Error('Load generation against the shared assessment site is disabled.');
}
const businessFailures = new Rate('business_failures');
export const options = {
  scenarios: {
    catalog: {
      executor: 'constant-arrival-rate',
      rate: 2,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 2,
      maxVUs: 5,
    },
  },
  // Illustrative staging budgets. Agree thresholds with the service owner first.
  thresholds: {
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '10s' }],
    business_failures: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '10s' }],
    checks: ['rate>0.99'],
    dropped_iterations: ['count==0'],
  },
};

export default function () {
  const response = http.get(`${target}/api/productsList`, {
    timeout: '10s',
    redirects: 0,
    tags: { endpoint: 'productsList' },
  });
  let body;
  try {
    body = response.json();
  } catch {
    body = null;
  }
  const success =
    response.status === 200 &&
    body?.responseCode === 200 &&
    Array.isArray(body?.products) &&
    body.products.length > 0;
  businessFailures.add(!success);
  check(response, {
    'HTTP 200': (r) => r.status === 200,
    'successful catalog payload': () => success,
  });
}
