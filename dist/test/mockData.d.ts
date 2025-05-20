import type { Transaction, TransactionState } from '../types';
export declare const errorMessages: {
    insufficientFunds: string;
    slippageTooHigh: string;
    rejected: string;
    networkError: string;
    contractError: string;
};
export declare const mockTransactions: Transaction[];
export declare const testScenarios: {
    initial: Map<string, TransactionState>;
    approvalFlow: Map<string, TransactionState>;
    failedExecution: Map<string, TransactionState>;
    skippedTransaction: Map<string, TransactionState>;
    cancelledFlow: Map<string, TransactionState>;
    complete: Map<string, TransactionState>;
};
export declare function createSuccessState(gasUsed?: string): TransactionState;
export declare function createProcessingState(): TransactionState;
export declare function createPendingState(): TransactionState;
export declare function createFailedState(error?: string): TransactionState;
export declare function createSkippedState(): TransactionState;
export declare function createCancelledState(): TransactionState;
export declare const sampleTransaction: Transaction;
