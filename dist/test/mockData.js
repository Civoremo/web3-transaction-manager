import { parseEther } from 'ethers';
// Common error messages for testing
export const errorMessages = {
    insufficientFunds: 'Insufficient funds for transaction',
    slippageTooHigh: 'Slippage tolerance exceeded',
    rejected: 'User rejected the transaction',
    networkError: 'Network error occurred',
    contractError: 'Contract execution failed'
};
// Mock transactions for demonstration
export const mockTransactions = [
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
            description: 'Approve USDC for trading'
        }
    },
    {
        id: 'tx-2',
        type: 'contract',
        params: {
            to: '0x2345678901234567890123456789012345678901',
            value: parseEther('0.1').toString(),
            data: '0x23b872dd...'
        },
        metadata: {
            title: 'Swap Tokens',
            description: 'Swap 100 USDC for ETH'
        }
    },
    {
        id: 'tx-3',
        type: 'standard',
        params: {
            to: '0x3456789012345678901234567890123456789012',
            value: parseEther('0.05').toString(),
            data: '0x'
        },
        metadata: {
            title: 'Transfer ETH',
            description: 'Send 0.05 ETH to recipient'
        }
    }
];
// Predefined test scenarios
export const testScenarios = {
    initial: new Map([
        ['tx-1', { status: 'pending' }],
        ['tx-2', { status: 'pending' }],
        ['tx-3', { status: 'pending' }]
    ]),
    approvalFlow: new Map([
        ['tx-1', { status: 'processing' }],
        ['tx-2', { status: 'pending' }],
        ['tx-3', { status: 'pending' }]
    ]),
    failedExecution: new Map([
        ['tx-1', { status: 'success', gasUsed: '21000' }],
        ['tx-2', { status: 'failed', error: errorMessages.insufficientFunds }],
        ['tx-3', { status: 'pending' }]
    ]),
    skippedTransaction: new Map([
        ['tx-1', { status: 'success', gasUsed: '21000' }],
        ['tx-2', { status: 'skipped' }],
        ['tx-3', { status: 'pending' }]
    ]),
    cancelledFlow: new Map([
        ['tx-1', { status: 'success', gasUsed: '21000' }],
        ['tx-2', { status: 'failed', error: errorMessages.insufficientFunds }],
        ['tx-3', { status: 'cancelled' }]
    ]),
    complete: new Map([
        ['tx-1', { status: 'success', gasUsed: '21000' }],
        ['tx-2', { status: 'success', gasUsed: '150000' }],
        ['tx-3', { status: 'success', gasUsed: '21000' }]
    ])
};
// Helper functions for state management
export function createSuccessState(gasUsed = '21000') {
    return {
        status: 'success',
        gasUsed
    };
}
export function createProcessingState() {
    return { status: 'processing' };
}
export function createPendingState() {
    return { status: 'pending' };
}
export function createFailedState(error = 'Transaction failed') {
    return {
        status: 'failed',
        error
    };
}
export function createSkippedState() {
    return { status: 'skipped' };
}
export function createCancelledState() {
    return { status: 'cancelled' };
}
// Sample transaction for individual component testing
export const sampleTransaction = mockTransactions[0];
