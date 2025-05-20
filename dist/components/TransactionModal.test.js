import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TransactionModal from './TransactionModal.svelte';
describe('TransactionModal', () => {
    const mockTransactions = [
        {
            id: '1',
            type: 'standard',
            params: {
                to: '0x123',
                value: '1000000000000000000'
            },
            metadata: {
                title: 'Send ETH',
                description: 'Send 1 ETH'
            }
        },
        {
            id: '2',
            type: 'contract',
            params: {
                to: '0x456',
                data: '0x123456'
            },
            metadata: {
                title: 'Contract Call',
                description: 'Call contract method'
            }
        }
    ];
    const createStates = (statuses) => {
        const states = new Map();
        mockTransactions.forEach((tx, index) => {
            states.set(tx.id, { status: statuses[index] });
        });
        return states;
    };
    it('should not render when closed', () => {
        render(TransactionModal, {
            props: {
                isOpen: false,
                transactions: mockTransactions,
                states: createStates(['pending', 'pending']),
                currentIndex: 0,
                theme: 'light'
            }
        });
        expect(screen.queryByText('Transaction Progress')).not.toBeInTheDocument();
    });
    it('should render when open', () => {
        render(TransactionModal, {
            props: {
                isOpen: true,
                transactions: mockTransactions,
                states: createStates(['pending', 'pending']),
                currentIndex: 0,
                theme: 'light'
            }
        });
        expect(screen.getByText('Transaction Progress')).toBeInTheDocument();
        expect(screen.getByText('Send ETH')).toBeInTheDocument();
    });
    it('should handle close button click', async () => {
        const handleClose = vi.fn();
        const { component } = render(TransactionModal, {
            props: {
                isOpen: true,
                transactions: mockTransactions,
                states: createStates(['pending', 'pending']),
                currentIndex: 0,
                theme: 'light'
            }
        });
        component.$on('close', handleClose);
        await fireEvent.click(screen.getByLabelText('Close modal'));
        expect(handleClose).toHaveBeenCalled();
    });
    it('should handle transaction execution', async () => {
        const handleExecute = vi.fn();
        const { component } = render(TransactionModal, {
            props: {
                isOpen: true,
                transactions: mockTransactions,
                states: createStates(['pending', 'pending']),
                currentIndex: 0,
                theme: 'light'
            }
        });
        component.$on('execute', handleExecute);
        await fireEvent.click(screen.getByText('Execute'));
        expect(handleExecute).toHaveBeenCalledWith(expect.objectContaining({
            detail: { transactionId: '1' }
        }));
    });
    it('should handle transaction retry', async () => {
        const handleRetry = vi.fn();
        const { component } = render(TransactionModal, {
            props: {
                isOpen: true,
                transactions: mockTransactions,
                states: createStates(['failed', 'pending']),
                currentIndex: 0,
                theme: 'light'
            }
        });
        component.$on('retry', handleRetry);
        await fireEvent.click(screen.getByText('Retry'));
        expect(handleRetry).toHaveBeenCalledWith(expect.objectContaining({
            detail: { transactionId: '1' }
        }));
    });
    it('should show completion message when all transactions succeed', () => {
        render(TransactionModal, {
            props: {
                isOpen: true,
                transactions: mockTransactions,
                states: createStates(['success', 'success']),
                currentIndex: 2,
                theme: 'light'
            }
        });
        expect(screen.getByText('All transactions completed successfully!')).toBeInTheDocument();
    });
    it('should show error message when transactions fail', () => {
        render(TransactionModal, {
            props: {
                isOpen: true,
                transactions: mockTransactions,
                states: createStates(['failed', 'pending']),
                currentIndex: 0,
                theme: 'light'
            }
        });
        expect(screen.getByText('Some transactions failed. Please retry failed transactions.')).toBeInTheDocument();
    });
    it('should apply dark theme when specified', () => {
        const { container } = render(TransactionModal, {
            props: {
                isOpen: true,
                transactions: mockTransactions,
                states: createStates(['pending', 'pending']),
                currentIndex: 0,
                theme: 'dark'
            }
        });
        expect(container.querySelector('.dark')).toBeInTheDocument();
    });
});
