import { ethers } from 'ethers';
// Mock contract addresses
export const TEST_CONTRACTS = {
    TOKEN: '0x1234567890123456789012345678901234567890',
    CONTRACT_1: '0x2345678901234567890123456789012345678901',
    CONTRACT_2: '0x3456789012345678901234567890123456789012',
    CONTRACT_3: '0x4567890123456789012345678901234567890123',
};
const MOCK_LENDER_ADDRESS = '0x1234567890123456789012345678901234567890';
const MOCK_CONTRACT_ADDRESS = '0x0987654321098765432109876543210987654321';
// Example of pre-encoded function data that would come from the frontend
const ENCODED_APPROVE = '0x095ea7b3000000000000000000000000123456789012345678901234567890123456789000000000000000000000000000000000000000000000000000000000000000ff';
const ENCODED_SET_CREDIT_MARKET = '0x7b123f450000000000000000000000001234567890123456789012345678901234567890ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000278d000000000000000000000000000000000000000000000000000000000063c25d5500000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000000';
const ENCODED_DEPOSIT = '0x4b78901200000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000123456789012345678901234567890123456789';
const ENCODED_SIGN = '0x3c7894560000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000006579fb3800000000000000000000000000000000000000000000000000000000000000066076312e302e3000000000000000000000000000000000000000000000000000';
export const TEST_TRANSACTION_FLOW = [
    {
        id: 'tx1',
        type: 'approval',
        params: {
            to: MOCK_CONTRACT_ADDRESS,
            data: ENCODED_APPROVE,
            value: '0'
        },
        metadata: {
            title: 'Approve USDC',
            buttonLabel: 'Approve',
            description: 'Approve USDC for protocol interaction'
        }
    },
    {
        id: 'tx2',
        type: 'contract',
        params: {
            to: MOCK_LENDER_ADDRESS,
            data: ENCODED_SET_CREDIT_MARKET,
            value: '0'
        },
        metadata: {
            title: 'Authorize auto-roll contract',
            buttonLabel: 'Authorize',
            description: 'Authorize the auto-roll contract'
        }
    },
    {
        id: 'tx3',
        type: 'standard',
        params: {
            to: MOCK_LENDER_ADDRESS,
            data: ENCODED_DEPOSIT,
            value: '0'
        },
        metadata: {
            title: 'Deposit and borrow',
            buttonLabel: 'Create Loan',
            description: 'Create your loan position'
        }
    },
    {
        id: 'tx4',
        type: 'standard',
        params: {
            to: MOCK_LENDER_ADDRESS,
            data: ENCODED_SIGN,
            value: '0'
        },
        metadata: {
            title: 'Sign auto-roll terms',
            buttonLabel: 'Sign',
            description: 'Sign the auto-roll terms'
        }
    }
];
// Helper function to get transaction by ID
export const getTransactionById = (id) => {
    return TEST_TRANSACTION_FLOW.find(tx => tx.id === id);
};
// Helper function to get next transaction in flow
export const getNextTransaction = (currentTxId) => {
    const currentIndex = TEST_TRANSACTION_FLOW.findIndex(tx => tx.id === currentTxId);
    if (currentIndex === -1 || currentIndex === TEST_TRANSACTION_FLOW.length - 1)
        return undefined;
    return TEST_TRANSACTION_FLOW[currentIndex + 1];
};
// Helper function to get transaction status message
export const getTransactionStatusMessage = (txId) => {
    const tx = getTransactionById(txId);
    if (!tx)
        return 'Unknown transaction';
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
