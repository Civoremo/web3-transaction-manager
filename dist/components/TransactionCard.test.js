import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import TransactionCard from './TransactionCard.svelte';
describe('TransactionCard', () => {
    const mockTransaction = {
        id: '1',
        type: 'standard',
        params: {
            to: '0x123',
            value: '1000000000000000000',
            data: '0x'
        },
        metadata: {
            title: 'Send ETH',
            description: 'Send 1 ETH'
        }
    };
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });
    it('should render transaction details', () => {
        const state = { status: 'pending' };
        render(TransactionCard, {
            props: {
                transaction: mockTransaction,
                state,
                onExecute: vi.fn(),
                onRetry: vi.fn()
            }
        });
        expect(screen.getByText('Send ETH')).toBeInTheDocument();
        expect(screen.getByText('Send 1 ETH')).toBeInTheDocument();
        expect(screen.getByText('0x123')).toBeInTheDocument();
        expect(screen.getByText('1000000000000000000 ETH')).toBeInTheDocument();
    });
    it('should show correct status text for different states', () => {
        const states = ['pending', 'processing', 'success', 'failed', 'cancelled'];
        const expectedTexts = ['Waiting to start', 'Processing...', 'Completed', 'Failed', 'Cancelled'];
        states.forEach((status, index) => {
            const { rerender } = render(TransactionCard, {
                props: {
                    transaction: mockTransaction,
                    state: { status },
                    onExecute: vi.fn(),
                    onRetry: vi.fn()
                }
            });
            expect(screen.getByText(expectedTexts[index])).toBeInTheDocument();
            cleanup();
        });
    });
    it('should show execute button for pending transactions', () => {
        const handleExecute = vi.fn();
        render(TransactionCard, {
            props: {
                transaction: mockTransaction,
                state: { status: 'pending' },
                onExecute: handleExecute,
                onRetry: vi.fn()
            }
        });
        const button = screen.getByText('Execute');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(handleExecute).toHaveBeenCalled();
    });
    it('should show retry button for failed transactions', () => {
        const handleRetry = vi.fn();
        render(TransactionCard, {
            props: {
                transaction: mockTransaction,
                state: { status: 'failed', error: 'Transaction failed' },
                onExecute: vi.fn(),
                onRetry: handleRetry
            }
        });
        const button = screen.getByText('Retry');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(handleRetry).toHaveBeenCalled();
    });
    it('should disable button during processing', () => {
        render(TransactionCard, {
            props: {
                transaction: mockTransaction,
                state: { status: 'processing' },
                onExecute: vi.fn(),
                onRetry: vi.fn()
            }
        });
        const button = screen.getByText('Processing...');
        expect(button).toBeDisabled();
    });
    it('should show error message when transaction fails', () => {
        const errorMessage = 'Transaction failed: insufficient funds';
        render(TransactionCard, {
            props: {
                transaction: mockTransaction,
                state: { status: 'failed', error: errorMessage },
                onExecute: vi.fn(),
                onRetry: vi.fn()
            }
        });
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    it('should show gas used when available', () => {
        render(TransactionCard, {
            props: {
                transaction: mockTransaction,
                state: { status: 'success', gasUsed: BigInt(21000) },
                onExecute: vi.fn(),
                onRetry: vi.fn()
            }
        });
        expect(screen.getByText('21000')).toBeInTheDocument();
    });
    it('should handle missing metadata gracefully', () => {
        const txWithoutMetadata = {
            ...mockTransaction,
            metadata: undefined
        };
        render(TransactionCard, {
            props: {
                transaction: txWithoutMetadata,
                state: { status: 'pending' },
                onExecute: vi.fn(),
                onRetry: vi.fn()
            }
        });
        expect(screen.getByText('Transaction')).toBeInTheDocument();
        expect(screen.getByText('No description provided')).toBeInTheDocument();
    });
    it('should timeout processing after 3 seconds', async () => {
        const handleTimeout = vi.fn();
        render(TransactionCard, {
            props: {
                transaction: mockTransaction,
                state: { status: 'processing' },
                onExecute: vi.fn(),
                onRetry: vi.fn(),
                onProcessingTimeout: handleTimeout,
                processingTimeout: 3000 // 3 seconds in milliseconds
            }
        });
        expect(screen.getByText('Processing...')).toBeInTheDocument();
        // Fast forward time by 3 seconds
        vi.advanceTimersByTime(3000);
        expect(handleTimeout).toHaveBeenCalledTimes(1);
    });
});
