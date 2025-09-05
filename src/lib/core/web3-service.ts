import * as ethers from 'ethers';
import type { Transaction, TransactionState } from '../types';

// EIP-712 types for typed data signing
interface EIP712Domain {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: string;
}

interface EIP712Types {
    [key: string]: Array<{ name: string; type: string }>;
}

export class Web3Service {
    private signer: ethers.Signer | null = null;
    private provider: ethers.providers.Provider | null = null;

    constructor(signer?: ethers.Signer) {
        if (signer) {
            this.setSigner(signer);
        }
    }

    setSigner(signer: ethers.Signer): void {
        this.signer = signer;
        this.provider = signer.provider!;
    }

    private ensureSigner(): ethers.Signer {
        if (!this.signer) {
            throw new Error('Signer not set. Call setSigner() first.');
        }
        return this.signer;
    }

    private ensureProvider(): ethers.providers.Provider {
        if (!this.provider) {
            throw new Error('Provider not set. Call setSigner() first.');
        }
        return this.provider;
    }

    async sendTransaction(tx: Transaction): Promise<ethers.providers.TransactionResponse> {
        const signer = this.ensureSigner();
        const txParams = {
            to: tx.params.to,
            data: tx.params.data || '0x',
            value: tx.params.value ? tx.params.value : '0',
            gasLimit: tx.params.gasLimit,
            gasPrice: tx.params.gasPrice
        };
        return await signer.sendTransaction(txParams);
    }

    async estimateGas(tx: Transaction): Promise<ethers.BigNumberish> {
        const provider = this.ensureProvider();
        const txParams = {
            to: tx.params.to,
            data: tx.params.data || '0x',
            value: tx.params.value ? tx.params.value : '0'
        };
        return await provider.estimateGas(txParams);
    }

    async signMessage(message: string): Promise<string> {
        const signer = this.ensureSigner();
        return await signer.signMessage(message);
    }

    async signTypedData(domain: EIP712Domain, types: EIP712Types, value: Record<string, unknown>): Promise<string> {
        const signer = this.ensureSigner();
        if ((signer as any)._signTypedData) {
            return await (signer as any)._signTypedData(domain, types, value);
        } else {
            throw new Error('Typed data signing not supported by this signer');
        }
    }

    async executeFetchRequest(tx: Transaction): Promise<unknown> {
        const { url, method = 'GET', body, headers = {} } = tx.params;
        
        if (!url) {
            throw new Error('URL is required for fetch transactions');
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: method !== 'GET' && body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    async waitForTransaction(txHash: string, confirmations: number = 1): Promise<TransactionState> {
        try {
            const provider = this.ensureProvider();
            const receipt = await provider.waitForTransaction(txHash, confirmations);
            if (!receipt) {
                throw new Error('Transaction receipt not found');
            }
            return {
                status: receipt.status === 1 ? 'success' : 'failed',
                hash: receipt.transactionHash,
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            return {
                status: 'failed',
                hash: txHash,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getChainId(): Promise<number> {
        const provider = this.ensureProvider();
        const network = await provider.getNetwork();
        return Number(network.chainId);
    }

    // The switchNetwork method should be handled by the app, not the library, since it requires window.ethereum
} 