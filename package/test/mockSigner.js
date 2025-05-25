import * as ethers from 'ethers';
export class MockSigner {
    provider = null;
    async sendTransaction(transaction) {
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Simulate random success/failure
        if (Math.random() > 0.2) { // 80% success rate
            const mockResponse = {
                hash: '0x' + Math.random().toString(16).slice(2, 42),
                from: '0x1234567890123456789012345678901234567890',
                to: transaction.to,
                data: transaction.data,
                value: transaction.value || BigInt(0),
                nonce: 0,
                gasLimit: BigInt(21000),
                gasPrice: BigInt(20000000000),
                chainId: 1,
                confirmations: 0,
                wait: async () => {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return {
                        status: 1,
                        transactionHash: '0x' + Math.random().toString(16).slice(2, 42),
                        transactionIndex: 0,
                        blockHash: '0x' + Math.random().toString(16).slice(2, 42),
                        blockNumber: 12345678,
                        from: '0x1234567890123456789012345678901234567890',
                        to: transaction.to,
                        contractAddress: null,
                        cumulativeGasUsed: BigInt(21000),
                        gasUsed: BigInt(21000),
                        effectiveGasPrice: BigInt(20000000000),
                        events: []
                    };
                }
            };
            return mockResponse;
        }
        else {
            throw new Error('Transaction failed: Insufficient funds');
        }
    }
    async getAddress() {
        return '0x1234567890123456789012345678901234567890';
    }
    async signMessage(message) {
        return '0x' + Math.random().toString(16).slice(2, 130);
    }
    async signTransaction(transaction) {
        return '0x' + Math.random().toString(16).slice(2, 130);
    }
    async signTypedData(domain, types, value) {
        return '0x' + Math.random().toString(16).slice(2, 130);
    }
    connect(provider) {
        this.provider = provider;
        return this;
    }
    // Required Signer interface methods
    async getNonce() {
        return 0;
    }
    async estimateGas(transaction) {
        return BigInt(21000);
    }
    async call(transaction) {
        return '0x';
    }
    async resolveName(name) {
        return null;
    }
    async populateCall(transaction) {
        return {
            to: transaction.to,
            data: transaction.data,
            value: transaction.value || BigInt(0)
        };
    }
    async populateTransaction(transaction) {
        return {
            to: transaction.to,
            data: transaction.data,
            value: transaction.value || BigInt(0),
            nonce: 0,
            gasLimit: BigInt(21000),
            gasPrice: BigInt(20000000000),
            chainId: 1
        };
    }
}
