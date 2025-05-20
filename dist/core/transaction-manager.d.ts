import type { Transaction, TransactionEvent, TransactionManagerConfig, TransactionState } from '../types';
export declare class TransactionManager {
    private transactions;
    private states;
    private currentIndex;
    private eventHandlers;
    private web3Service;
    private config;
    constructor(transactions?: Transaction[], config?: TransactionManagerConfig);
    on(event: TransactionEvent, handler: Function): void;
    private emit;
    connect(): Promise<void>;
    start(): Promise<void>;
    processCurrentTransaction(): Promise<void>;
    getState(txId: string): TransactionState | undefined;
    getAllStates(): Map<string, TransactionState>;
    getCurrentIndex(): number;
    getProgress(): number;
    reset(): void;
}
