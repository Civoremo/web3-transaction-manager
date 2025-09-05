import * as ethers from 'ethers';
import type { Transaction, TransactionState } from '../types';
interface EIP712Domain {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: string;
}
interface EIP712Types {
    [key: string]: Array<{
        name: string;
        type: string;
    }>;
}
export declare class Web3Service {
    private signer;
    private provider;
    constructor(signer?: ethers.Signer);
    setSigner(signer: ethers.Signer): void;
    private ensureSigner;
    private ensureProvider;
    sendTransaction(tx: Transaction): Promise<ethers.providers.TransactionResponse>;
    estimateGas(tx: Transaction): Promise<ethers.BigNumberish>;
    signMessage(message: string): Promise<string>;
    signTypedData(domain: EIP712Domain, types: EIP712Types, value: Record<string, unknown>): Promise<string>;
    executeFetchRequest(tx: Transaction): Promise<unknown>;
    waitForTransaction(txHash: string, confirmations?: number): Promise<TransactionState>;
    getChainId(): Promise<number>;
}
export {};
