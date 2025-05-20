import type { BigNumberish } from 'ethers';
/**
 * Transaction types for different kinds of blockchain transactions
 * - 'approval': Token approval transactions (e.g., approving USDC for a protocol)
 * - 'contract': Smart contract interaction transactions (e.g., calling contract functions)
 * - 'standard': Standard ETH transfers or simple transactions
 */
export type TransactionType = 'approval' | 'contract' | 'standard';
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
export type TransactionEvent = 'transactionStart' | 'transactionSuccess' | 'transactionError' | 'allComplete';
