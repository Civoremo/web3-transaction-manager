import { TransactionResponse, type BigNumberish } from 'ethers';
import type { Transaction, TransactionState } from '../types';
export declare class Web3Service {
    private provider;
    private signer;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(tx: Transaction): Promise<TransactionResponse>;
    estimateGas(tx: Transaction): Promise<BigNumberish>;
    waitForTransaction(txHash: string, confirmations?: number): Promise<TransactionState>;
    getChainId(): Promise<number>;
    switchNetwork(chainId: number): Promise<void>;
}
