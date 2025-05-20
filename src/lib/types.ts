export type TransactionType = 'approval' | 'contract' | 'standard';
export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'skipped';

export interface TransactionState {
    status: TransactionStatus;
    hash?: string;
    error?: Error;
}

export interface TransactionParams {
    to: string;
    data: string; // Pre-encoded function data
    value?: string;
    from?: string;
    gasLimit?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
}

export interface TransactionMetadata {
    title: string;
    buttonLabel: string;
    description?: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    params: TransactionParams;
    metadata: TransactionMetadata;
} 