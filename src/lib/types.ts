export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'skipped' | 'cancelled';

export interface TransactionState {
    status: TransactionStatus;
    gasUsed?: string;
    error?: string;
}

export interface Transaction {
    id: string;
    type: 'approval' | 'contract' | 'standard';
    params: {
        to: string;
        value: string;
        data: string;
    };
    metadata?: {
        title: string;
        description: string;
    };
} 