import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Fix for "RequestInit: Expected signal to be an instance of AbortSignal"
// This aligns the global AbortController with the one Node's fetch expects
const globalAbortController = globalThis.AbortController;
const globalAbortSignal = globalThis.AbortSignal;

beforeAll(() => {
  globalThis.AbortController = globalAbortController;
  globalThis.AbortSignal = globalAbortSignal;
});

// Clean up the DOM after each test
afterEach(() => {
  cleanup();
});