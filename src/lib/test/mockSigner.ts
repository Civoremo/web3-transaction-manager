import type { 
    Signer, 
    Provider, 
    TransactionRequest, 
    TransactionResponse,
    TypedDataDomain,
    TypedDataField,
    TransactionLike
} from 'ethers';

export class MockSigner implements Signer {
    provider: Provider | null = null;

    async sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure
        if (Math.random() > 0.2) { // 80% success rate
            const mockResponse = {
                hash: '0x' + Math.random().toString(16).slice(2, 42),
                from: '0x1234567890123456789012345678901234567890',
                to: transaction.to as string,
                data: transaction.data as string,
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
                        to: transaction.to as string,
                        contractAddress: null,
                        cumulativeGasUsed: BigInt(21000),
                        gasUsed: BigInt(21000),
                        effectiveGasPrice: BigInt(20000000000),
                        events: []
                    };
                }
            };
            return mockResponse as unknown as TransactionResponse;
        } else {
            throw new Error('Transaction failed: Insufficient funds');
        }
    }

    async getAddress(): Promise<string> {
        return '0x1234567890123456789012345678901234567890';
    }

    async signMessage(message: string | Uint8Array): Promise<string> {
        return '0x' + Math.random().toString(16).slice(2, 130);
    }

    async signTransaction(transaction: TransactionRequest): Promise<string> {
        return '0x' + Math.random().toString(16).slice(2, 130);
    }

    async signTypedData(
        domain: TypedDataDomain,
        types: Record<string, TypedDataField[]>,
        value: Record<string, any>
    ): Promise<string> {
        return '0x' + Math.random().toString(16).slice(2, 130);
    }

    connect(provider: Provider): Signer {
        this.provider = provider;
        return this as unknown as Signer;
    }

    // Required Signer interface methods
    async getNonce(): Promise<number> {
        return 0;
    }

    async estimateGas(transaction: TransactionRequest): Promise<bigint> {
        return BigInt(21000);
    }

    async call(transaction: TransactionRequest): Promise<string> {
        return '0x';
    }

    async resolveName(name: string): Promise<string | null> {
        return null;
    }

    async populateCall(transaction: TransactionRequest): Promise<TransactionLike<string>> {
        return {
            to: transaction.to as string,
            data: transaction.data as string,
            value: transaction.value || BigInt(0)
        };
    }

    async populateTransaction(transaction: TransactionRequest): Promise<TransactionLike<string>> {
        return {
            to: transaction.to as string,
            data: transaction.data as string,
            value: transaction.value || BigInt(0),
            nonce: 0,
            gasLimit: BigInt(21000),
            gasPrice: BigInt(20000000000),
            chainId: 1
        };
    }
} 