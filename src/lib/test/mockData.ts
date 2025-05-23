// @ts-ignore
import ethers from 'ethers';
import type { Transaction, TransactionState } from '../types';

// Common error messages for testing
export const errorMessages = {
    insufficientFunds: 'Insufficient funds for transaction',
    slippageTooHigh: 'Slippage tolerance exceeded',
    rejected: 'User rejected the transaction',
    networkError: 'Network error occurred',
    contractError: 'Contract execution failed'
};

// Mock transactions for demonstration
export const mockTransactions: Transaction[] = [
    {
        id: 'tx-1',
        type: 'approval',
        params: {
            to: '0x1234567890123456789012345678901234567890',
            value: '0',
            data: '0x095ea7b3...'
        },
        metadata: {
            title: 'Token Approval',
            description: 'Approve USDC for trading',
            buttonLabel: 'Approve'
        }
    },
    {
        id: 'tx-2',
        type: 'contract',
        params: {
            to: '0x2345678901234567890123456789012345678901',
            value: ethers.utils.parseEther('0.1').toString(),
            data: '0x23b872dd...'
        },
        metadata: {
            title: 'Swap Tokens',
            description: 'Swap 100 USDC for ETH',
            buttonLabel: 'Swap'
        }
    },
    {
        id: 'tx-3',
        type: 'standard',
        params: {
            to: '0x3456789012345678901234567890123456789012',
            value: ethers.utils.parseEther('0.05').toString(),
            data: '0x'
        },
        metadata: {
            title: 'Transfer ETH',
            description: 'Send 0.05 ETH to recipient',
            buttonLabel: 'Transfer'
        }
    }
];

// Predefined test scenarios
export const testScenarios = {
    initial: new Map<string, TransactionState>([
        ['tx-1', { status: 'pending' }],
        ['tx-2', { status: 'pending' }],
        ['tx-3', { status: 'pending' }]
    ]),
    approvalFlow: new Map<string, TransactionState>([
        ['tx-1', { status: 'processing' }],
        ['tx-2', { status: 'pending' }],
        ['tx-3', { status: 'pending' }]
    ]),
    failedExecution: new Map<string, TransactionState>([
        ['tx-1', { status: 'success' }],
        ['tx-2', { status: 'failed' }],
        ['tx-3', { status: 'pending' }]
    ]),
    skippedTransaction: new Map<string, TransactionState>([
        ['tx-1', { status: 'success' }],
        ['tx-2', { status: 'skipped' }],
        ['tx-3', { status: 'pending' }]
    ]),
    cancelledFlow: new Map<string, TransactionState>([
        ['tx-1', { status: 'success' }],
        ['tx-2', { status: 'failed' }],
        ['tx-3', { status: 'failed' }]
    ]),
    complete: new Map<string, TransactionState>([
        ['tx-1', { status: 'success' }],
        ['tx-2', { status: 'success' }],
        ['tx-3', { status: 'success' }]
    ])
};

// Helper functions for state management
export function createSuccessState(): TransactionState {
    return {
        status: 'success'
    };
}

export function createProcessingState(): TransactionState {
    return { status: 'processing' };
}

export function createPendingState(): TransactionState {
    return { status: 'pending' };
}

export function createFailedState(): TransactionState {
    return {
        status: 'failed'
    };
}

export function createSkippedState(): TransactionState {
    return { status: 'skipped' };
}

// Sample transaction for individual component testing
export const sampleTransaction = mockTransactions[0]; 