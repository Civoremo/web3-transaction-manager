import '@testing-library/jest-dom';

declare module 'vitest' {
    interface Assertion<T = any> extends jest.Matchers<void, T> {}
}

declare global {
    namespace jest {
        interface Matchers<R, T> {
            toBeInTheDocument(): R;
            toHaveClass(className: string): R;
            toHaveStyle(style: Record<string, string>): R;
        }
    }
} 