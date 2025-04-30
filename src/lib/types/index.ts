import type { BigNumberish } from 'ethers';

export type TransactionType = 'standard' | 'contract' | 'approval' | 'signature';

export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

export interface TransactionParams {
    to: string;
    data?: string;
    value?: string;
    gasLimit?: string;
    gasPrice?: string;
}

export interface TransactionMetadata {
    title: string;
    description: string;
    estimatedGas?: string;
    requirement?: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    params: TransactionParams;
    metadata?: TransactionMetadata;
}

export interface TransactionState {
    status: TransactionStatus;
    hash?: string;
    error?: string;
    gasUsed?: BigNumberish;
    blockNumber?: number;
}

export interface TransactionManagerConfig {
    autoApprove?: boolean;
    gasMultiplier?: number;
    confirmations?: number;
    timeout?: number;
}

export type TransactionEvent = 
    | 'transactionStart'
    | 'transactionSuccess'
    | 'transactionError'
    | 'allComplete'; 