import { expect, afterEach } from 'bun:test';
import { cleanup } from '@testing-library/react';

// Add custom matchers
Object.assign(expect, require('@testing-library/jest-dom/matchers'));

afterEach(() => {
    cleanup();
});