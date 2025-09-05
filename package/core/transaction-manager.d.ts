import type { Transaction, TransactionEvent, TransactionManagerConfig, TransactionState } from '../types';
import type { Signer } from 'ethers';
export declare class TransactionManager {
    private transactions;
    private states;
    private currentIndex;
    private eventHandlers;
    private web3Service;
    private config;
    constructor(transactions?: Transaction[], config?: TransactionManagerConfig);
    setSigner(signer: Signer): void;
    on(event: TransactionEvent, handler: (data?: unknown) => void): void;
    private emit;
    start(): Promise<void>;
    processCurrentTransaction(): Promise<void>;
    private handleFetchTransaction;
    private handleSignatureTransaction;
    private handleBlockchainTransaction;
    getState(txId: string): TransactionState | undefined;
    getAllStates(): Map<string, TransactionState>;
    getCurrentIndex(): number;
    getProgress(): number;
    reset(): void;
}
