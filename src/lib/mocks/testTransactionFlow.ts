import type { Transaction } from '../types';

// Mock contract addresses
export const TEST_CONTRACTS = {
    TOKEN: '0x1234567890123456789012345678901234567890',
    CONTRACT_1: '0x2345678901234567890123456789012345678901',
    CONTRACT_2: '0x3456789012345678901234567890123456789012',
    CONTRACT_3: '0x4567890123456789012345678901234567890123',
};

export const TEST_TRANSACTION_FLOW: Transaction[] = [
    {
        id: 'tx-approve',
        type: 'approval',
        params: {
            to: TEST_CONTRACTS.TOKEN,
            value: '0',
            data: '0x095ea7b3' // approve(address,uint256)
        },
        metadata: {
            title: 'Approve Token',
            description: 'Approve tokens for smart contract interaction'
        }
    },
    {
        id: 'tx-deposit',
        type: 'contract',
        params: {
            to: TEST_CONTRACTS.CONTRACT_1,
            value: '0',
            data: '0xb6b55f25' // deposit(uint256)
        },
        metadata: {
            title: 'Deposit Funds',
            description: 'Deposit tokens into the protocol'
        }
    },
    {
        id: 'tx-contract1',
        type: 'contract',
        params: {
            to: TEST_CONTRACTS.CONTRACT_1,
            value: '0',
            data: '0xfe4b84df' // initialize(uint256,uint256)
        },
        metadata: {
            title: 'Initialize Position',
            description: 'Set up your position in Contract 1'
        }
    },
    {
        id: 'tx-contract2',
        type: 'contract',
        params: {
            to: TEST_CONTRACTS.CONTRACT_2,
            value: '0',
            data: '0x94b918de' // optimize(uint256,uint256)
        },
        metadata: {
            title: 'Optimize Strategy',
            description: 'Optimize your position in Contract 2'
        }
    },
    {
        id: 'tx-contract3',
        type: 'contract',
        params: {
            to: TEST_CONTRACTS.CONTRACT_3,
            value: '0',
            data: '0x89f71d3e' // finalize(uint256,bool)
        },
        metadata: {
            title: 'Finalize Setup',
            description: 'Complete setup in Contract 3'
        }
    }
];

// Helper function to get transaction by ID
export const getTransactionById = (id: string): Transaction | undefined => {
    return TEST_TRANSACTION_FLOW.find(tx => tx.id === id);
};

// Helper function to get next transaction in flow
export const getNextTransaction = (currentTxId: string): Transaction | undefined => {
    const currentIndex = TEST_TRANSACTION_FLOW.findIndex(tx => tx.id === currentTxId);
    if (currentIndex === -1 || currentIndex === TEST_TRANSACTION_FLOW.length - 1) return undefined;
    return TEST_TRANSACTION_FLOW[currentIndex + 1];
};

// Helper function to get transaction status message
export const getTransactionStatusMessage = (txId: string): string => {
    const tx = getTransactionById(txId);
    if (!tx) return 'Unknown transaction';
    
    switch (tx.id) {
        case 'tx-approve':
            return 'Approving tokens...';
        case 'tx-deposit':
            return 'Depositing funds...';
        case 'tx-contract1':
            return 'Initializing position...';
        case 'tx-contract2':
            return 'Optimizing strategy...';
        case 'tx-contract3':
            return 'Finalizing setup...';
        default:
            return 'Processing transaction...';
    }
}; 