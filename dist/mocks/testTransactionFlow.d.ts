import type { Transaction } from '../types';
export declare const TEST_CONTRACTS: {
    TOKEN: string;
    CONTRACT_1: string;
    CONTRACT_2: string;
    CONTRACT_3: string;
};
export declare const TEST_TRANSACTION_FLOW: Transaction[];
export declare const getTransactionById: (id: string) => Transaction | undefined;
export declare const getNextTransaction: (currentTxId: string) => Transaction | undefined;
export declare const getTransactionStatusMessage: (txId: string) => string;
