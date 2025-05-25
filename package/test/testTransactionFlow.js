export const TEST_TRANSACTION_FLOW = [
    {
        id: 'approve',
        type: 'approval',
        params: {
            to: '0x1234567890123456789012345678901234567890',
            data: '0x095ea7b300000000000000000000000012345678901234567890123456789012345678900000000000000000000000000000000000000000000000000000000000000000'
        },
        metadata: {
            title: 'Approve USDC',
            buttonLabel: 'Approve'
        }
    },
    {
        id: 'borrow',
        type: 'contract',
        params: {
            to: '0x1234567890123456789012345678901234567890',
            data: '0x2e17de780000000000000000000000000000000000000000000000000000000000000000'
        },
        metadata: {
            title: 'Borrow USDC',
            buttonLabel: 'Borrow'
        }
    },
    {
        id: 'repay',
        type: 'contract',
        params: {
            to: '0x1234567890123456789012345678901234567890',
            data: '0x2e17de780000000000000000000000000000000000000000000000000000000000000000'
        },
        metadata: {
            title: 'Repay USDC',
            buttonLabel: 'Repay'
        }
    },
    {
        id: 'withdraw',
        type: 'standard',
        params: {
            to: '0x1234567890123456789012345678901234567890',
            data: '0x', // Empty data for ETH transfer
            value: '1000000000000000000' // 1 ETH
        },
        metadata: {
            title: 'Withdraw ETH',
            buttonLabel: 'Withdraw'
        }
    },
    {
        id: 'deposit',
        type: 'standard',
        params: {
            to: '0x1234567890123456789012345678901234567890',
            data: '0x', // Empty data for ETH transfer
            value: '2000000000000000000' // 2 ETH
        },
        metadata: {
            title: 'Deposit ETH',
            buttonLabel: 'Deposit'
        }
    }
];
