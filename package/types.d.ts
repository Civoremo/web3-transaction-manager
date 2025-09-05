export type TransactionType = 'approval' | 'contract' | 'standard' | 'fetch' | 'signature';
export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'skipped';
export interface TransactionState {
    status: TransactionStatus;
    hash?: string;
    error?: string;
    gasUsed?: string | number;
    blockNumber?: number;
    signature?: string;
    signedMessage?: string;
    fetchResult?: unknown;
}
export interface TransactionParams {
    to?: string;
    data?: string;
    value?: string;
    from?: string;
    gasLimit?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    gasPrice?: string;
    url?: string;
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    message?: string;
    domain?: unknown;
    signatureType?: 'personal' | 'typed';
}
export interface TransactionMetadata {
    title: string;
    buttonLabel: string;
    description?: string;
    estimatedGas?: string;
    requirement?: string;
}
export interface Transaction {
    id: string;
    type: TransactionType;
    params: TransactionParams;
    metadata: TransactionMetadata;
}
export interface TransactionManagerConfig {
    autoApprove?: boolean;
    gasMultiplier?: number;
    confirmations?: number;
    timeout?: number;
}
export type TransactionEvent = 'transactionStart' | 'transactionSuccess' | 'transactionError' | 'allComplete';
