import type { BigNumberish } from 'ethers';
import * as ethers from 'ethers';
import type { ThemeConfig } from './theme';

/**
 * Transaction types for different kinds of blockchain transactions
 * - 'approval': Token approval transactions (e.g., approving USDC for a protocol)
 * - 'contract': Smart contract interaction transactions (e.g., calling contract functions)
 * - 'standard': Standard ETH transfers or simple transactions
 * - 'fetch': HTTP requests to external APIs
 * - 'signature': Message signing operations
 */
export type TransactionType = 'approval' | 'contract' | 'standard' | 'fetch' | 'signature';

export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

export interface TransactionParams {
    // Blockchain transaction parameters
    to?: string;
    data?: string;
    value?: string;
    gasLimit?: string;
    gasPrice?: string;
    // Fetch request parameters
    url?: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    // Signature parameters
    message?: string;
    domain?: any;
    signatureType?: 'personal' | 'typed';
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
    // Signature result fields
    signature?: string;
    signedMessage?: string;
    // Fetch result fields
    fetchResult?: any;
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

export interface TransactionModalProps {
    isOpen: boolean;
    transactions: Transaction[];
    signer: ethers.Signer;
    address: string;
    theme?: 'light' | 'dark';
    title?: string;
    subtitle?: string;
    redirectUrl?: string;
    socialLinks?: Array<{label: string, url: string}>;
    blockExplorerUrl: string;
    supportChannelUrl?: string;
    customTheme?: Partial<ThemeConfig>;
    closeOnOverlayClick?: boolean;
    successMessage?: string;
    redirectMessage?: string;
    showHelpSection?: boolean;
    helpMessage?: string;
    helpRedirectText?: string;
    showFinalSuccessScreen?: boolean;
} 