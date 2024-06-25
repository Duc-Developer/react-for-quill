import { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { Expect as OriginalExpect } from 'bun:test';
// Extend the expect interface
declare module 'bun:test' {
    export default interface Expect<T = unknown>
    extends TestingLibraryMatchers<ReturnType<any>, T> {}
}
