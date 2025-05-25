import '@testing-library/jest-dom';
import { vi } from 'vitest';
// Mock window.ethereum
const mockEthereum = {
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
    isMetaMask: true
};
Object.defineProperty(window, 'ethereum', {
    value: mockEthereum,
    writable: true
});
// Reset all mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
    mockEthereum.request.mockReset();
    mockEthereum.on.mockReset();
    mockEthereum.removeListener.mockReset();
});
