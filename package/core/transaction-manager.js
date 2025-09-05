import { Web3Service } from './web3-service';
export class TransactionManager {
    transactions = [];
    states = new Map();
    currentIndex = -1;
    eventHandlers = new Map();
    web3Service;
    config;
    constructor(transactions = [], config = {}) {
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
    setSigner(signer) {
        this.web3Service.setSigner(signer);
    }
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event)?.push(handler);
    }
    emit(event, data) {
        this.eventHandlers.get(event)?.forEach(handler => handler(data));
    }
    async start() {
        if (this.currentIndex >= 0) {
            throw new Error('Transaction flow already started');
        }
        if (this.transactions.length === 0) {
            throw new Error('No transactions to process');
        }
        this.currentIndex = 0;
        await this.processCurrentTransaction();
    }
    async processCurrentTransaction() {
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
            let txState;
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
            }
            else {
                this.emit('transactionError', { transaction: tx, error: txState.error });
            }
        }
        catch (error) {
            const errorState = {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
            this.states.set(tx.id, errorState);
            this.emit('transactionError', { transaction: tx, error: errorState.error });
        }
    }
    async handleFetchTransaction(tx) {
        try {
            const fetchResult = await this.web3Service.executeFetchRequest(tx);
            return {
                status: 'success',
                fetchResult
            };
        }
        catch (error) {
            return {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Fetch failed'
            };
        }
    }
    async handleSignatureTransaction(tx) {
        try {
            const { message, domain, signatureType = 'personal' } = tx.params;
            if (!message) {
                throw new Error('No message provided for signature');
            }
            let signature;
            if (signatureType === 'typed' && domain) {
                // EIP-712 typed signature
                const typedMessage = message;
                signature = await this.web3Service.signTypedData(domain, typedMessage.types, typedMessage.value);
            }
            else {
                // Personal signature
                signature = await this.web3Service.signMessage(message);
            }
            return {
                status: 'success',
                signature,
                signedMessage: message
            };
        }
        catch (error) {
            return {
                status: 'failed',
                error: error instanceof Error ? error.message : 'Signature failed'
            };
        }
    }
    async handleBlockchainTransaction(tx) {
        // Estimate gas
        const estimatedGas = await this.web3Service.estimateGas(tx);
        tx.params.gasLimit = Math.ceil(Number(estimatedGas) * this.config.gasMultiplier).toString();
        // Send transaction
        const response = await this.web3Service.sendTransaction(tx);
        // Wait for confirmation
        return await this.web3Service.waitForTransaction(response.hash, this.config.confirmations);
    }
    getState(txId) {
        return this.states.get(txId);
    }
    getAllStates() {
        return new Map(this.states);
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    getProgress() {
        if (this.transactions.length === 0)
            return 0;
        if (this.currentIndex === -1)
            return 0;
        return (this.currentIndex / this.transactions.length) * 100;
    }
    reset() {
        this.currentIndex = -1;
        this.transactions.forEach(tx => {
            this.states.set(tx.id, { status: 'pending' });
        });
    }
}
