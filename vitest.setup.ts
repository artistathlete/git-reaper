import { beforeAll } from 'vitest';

// Fix for "RequestInit: Expected signal to be an instance of AbortSignal"
// This aligns the global AbortController with the one Node's fetch expects
const globalAbortController = globalThis.AbortController;
const globalAbortSignal = globalThis.AbortSignal;

beforeAll(() => {
  globalThis.AbortController = globalAbortController;
  globalThis.AbortSignal = globalAbortSignal;
});
