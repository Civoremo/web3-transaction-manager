import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ProgressTracker from './ProgressTracker.svelte';
import type { Transaction, TransactionState } from '../types';

describe('ProgressTracker', () => {
    const mockTransactions: Transaction[] = [
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

    const createStates = (statuses: TransactionState['status'][]): Map<string, TransactionState> => {
        const states = new Map<string, TransactionState>();
        mockTransactions.forEach((tx, index) => {
            states.set(tx.id, { status: statuses[index] });
        });
        return states;
    };

    it('should render all transaction steps', () => {
        const states = createStates(['pending', 'pending']);
        render(ProgressTracker, {
            transactions: mockTransactions,
            states,
            currentIndex: 0
        });

        expect(screen.getByText('Send ETH')).toBeInTheDocument();
        expect(screen.getByText('Contract Call')).toBeInTheDocument();
    });

    it('should show correct progress for completed transactions', () => {
        const states = createStates(['success', 'pending']);
        render(ProgressTracker, {
            transactions: mockTransactions,
            states,
            currentIndex: 1
        });

        expect(screen.getByText('1 of 2 transactions completed')).toBeInTheDocument();
    });

    it('should display success indicators for completed transactions', () => {
        const states = createStates(['success', 'pending']);
        const { container } = render(ProgressTracker, {
            transactions: mockTransactions,
            states,
            currentIndex: 1
        });

        const steps = container.querySelectorAll('.step');
        expect(steps[0]).toHaveClass('completed');
        expect(steps[1]).not.toHaveClass('completed');
    });

    it('should display failure indicators for failed transactions', () => {
        const states = createStates(['failed', 'pending']);
        const { container } = render(ProgressTracker, {
            transactions: mockTransactions,
            states,
            currentIndex: 0
        });

        const steps = container.querySelectorAll('.step');
        expect(steps[0]).toHaveClass('failed');
    });

    it('should highlight current transaction', () => {
        const states = createStates(['pending', 'pending']);
        const { container } = render(ProgressTracker, {
            transactions: mockTransactions,
            states,
            currentIndex: 0
        });

        const steps = container.querySelectorAll('.step');
        expect(steps[0]).toHaveClass('active');
        expect(steps[1]).not.toHaveClass('active');
    });

    it('should show progress bar at correct width', () => {
        const states = createStates(['success', 'pending']);
        const { container } = render(ProgressTracker, {
            transactions: mockTransactions,
            states,
            currentIndex: 1
        });

        const progressFill = container.querySelector('.progress-fill');
        expect(progressFill).toHaveStyle({ width: '50%' });
    });
}); 