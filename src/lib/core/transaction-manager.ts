import type { Transaction, TransactionEvent, TransactionManagerConfig, TransactionState } from '../types';
import { Web3Service } from './web3-service';
import type { Signer } from 'ethers';

export class TransactionManager {
    private transactions: Transaction[] = [];
    private states: Map<string, TransactionState> = new Map();
    private currentIndex = -1;
    private eventHandlers: Map<TransactionEvent, ((data?: unknown) => void)[]> = new Map();
    private web3Service: Web3Service;
    private config: Required<TransactionManagerConfig>;

    constructor(
        transactions: Transaction[] = [],
        config: TransactionManagerConfig = {}
    ) {
        this.transactions = transactions;
        this.web3Service = new Web3Service();
        this.config = {
            autoApprove: config.autoApprove ?? false,
            gasMultiplier: config.gasMultiplier ?? 1.1,
            confirmations: config.confirmations ?? 1,
            timeout: config.timeout ?? 300000 // 5 minutes
        };

        // Initialize transaction states
        this.transactions.forEach(tx => {
            this.states.set(tx.id, { status: 'pending' });
        });
    }

    setSigner(signer: Signer): void {
        this.web3Service.setSigner(signer);
    }

    on(event: TransactionEvent, handler: (data?: unknown) => void): void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)?.push(handler);
    }

    private emit(event: TransactionEvent, data?: unknown): void {
        this.eventHandlers.get(event)?.forEach(handler => handler(data));
    }

    async start(): Promise<void> {
        if (this.currentIndex >= 0) {
            throw new Error('Transaction flow already started');
        }
        if (this.transactions.length === 0) {
            throw new Error('No transactions to process');
        }

        this.currentIndex = 0;
        await this.processCurrentTransaction();
    }

    async processCurrentTransaction(): Promise<void> {
        if (this.currentIndex >= this.transactions.length) {
            this.emit('allComplete');
            return;
        }

        const tx = this.transactions[this.currentIndex];
        const state = this.states.get(tx.id);

        if (state?.status === 'success') {
            this.currentIndex++;
            await this.processCurrentTransaction();
            return;
        }

        try {
            this.emit('transactionStart', { transaction: tx });
            this.states.set(tx.id, { status: 'processing' });

            let txState: TransactionState;

            // Handle different transaction types
            switch (tx.type) {
                case 'fetch':
                    txState = await this.handleFetchTransaction(tx);
                    break;
                case 'signature':
                    txState = await this.handleSignatureTransaction(tx);
                    break;
                default:
                    txState = await this.handleBlockchainTransaction(tx);
            }

            this.states.set(tx.id, txState);

            if (txState.status === 'success') {
                this.emit('transactionSuccess', { transaction: tx, receipt: txState });
                this.currentIndex++;
                if (this.config.autoApprove) {
                    await this.processCurrentTransaction();
                }
            } else {
                this.emit('transactionError', { transaction: tx, error: txState.error });
            }
        } catch (error) {
            const errorState: TransactionState = {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
            this.states.set(tx.id, errorState);
            this.emit('transactionError', { transaction: tx, error: errorState.error });
        }
    }

    private async handleFetchTransaction(tx: Transaction): Promise<TransactionState> {
        try {
            const fetchResult = await this.web3Service.executeFetchRequest(tx);
            
            return {
                status: 'success',
                fetchResult
            } as TransactionState;
        } catch (error) {
            return {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Fetch failed'
            } as TransactionState;
        }
    }

    private async handleSignatureTransaction(tx: Transaction): Promise<TransactionState> {
        try {
            const { message, domain, signatureType = 'personal' } = tx.params;
            
            if (!message) {
                throw new Error('No message provided for signature');
            }

            let signature: string;
            
            if (signatureType === 'typed' && domain) {
                // EIP-712 typed signature
                const typedMessage = message as unknown as { types: any; value: any };
                signature = await this.web3Service.signTypedData(domain, typedMessage.types, typedMessage.value);
            } else {
                // Personal signature
                signature = await this.web3Service.signMessage(message as string);
            }

            return {
                status: 'success',
                signature,
                signedMessage: message
            } as TransactionState;
        } catch (error) {
            return {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Signature failed'
            } as TransactionState;
        }
    }

    private async handleBlockchainTransaction(tx: Transaction): Promise<TransactionState> {
        // Estimate gas
        const estimatedGas = await this.web3Service.estimateGas(tx);
        tx.params.gasLimit = Math.ceil(Number(estimatedGas) * this.config.gasMultiplier).toString();

        // Send transaction
        const response = await this.web3Service.sendTransaction(tx);
        
        // Wait for confirmation
        return await this.web3Service.waitForTransaction(
            response.hash,
            this.config.confirmations
        );
    }

    getState(txId: string): TransactionState | undefined {
        return this.states.get(txId);
    }

    getAllStates(): Map<string, TransactionState> {
        return new Map(this.states);
    }

    getCurrentIndex(): number {
        return this.currentIndex;
    }

    getProgress(): number {
        if (this.transactions.length === 0) return 0;
        if (this.currentIndex === -1) return 0;
        return (this.currentIndex / this.transactions.length) * 100;
    }

    reset(): void {
        this.currentIndex = -1;
        this.transactions.forEach(tx => {
            this.states.set(tx.id, { status: 'pending' });
        });
    }
} 