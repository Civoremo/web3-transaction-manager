import * as ethers from 'ethers';
export class Web3Service {
    signer = null;
    provider = null;
    constructor(signer) {
        if (signer) {
            this.setSigner(signer);
        }
    }
    setSigner(signer) {
        this.signer = signer;
        this.provider = signer.provider;
    }
    ensureSigner() {
        if (!this.signer) {
            throw new Error('Signer not set. Call setSigner() first.');
        }
        return this.signer;
    }
    ensureProvider() {
        if (!this.provider) {
            throw new Error('Provider not set. Call setSigner() first.');
        }
        return this.provider;
    }
    async sendTransaction(tx) {
        const signer = this.ensureSigner();
        const txParams = {
            to: tx.params.to,
            data: tx.params.data || '0x',
            value: tx.params.value ? tx.params.value : '0',
            gasLimit: tx.params.gasLimit,
            gasPrice: tx.params.gasPrice
        };
        return await signer.sendTransaction(txParams);
    }
    async estimateGas(tx) {
        const provider = this.ensureProvider();
        const txParams = {
            to: tx.params.to,
            data: tx.params.data || '0x',
            value: tx.params.value ? tx.params.value : '0'
        };
        return await provider.estimateGas(txParams);
    }
    async signMessage(message) {
        const signer = this.ensureSigner();
        return await signer.signMessage(message);
    }
    async signTypedData(domain, types, value) {
        const signer = this.ensureSigner();
        if (signer._signTypedData) {
            return await signer._signTypedData(domain, types, value);
        }
        else {
            throw new Error('Typed data signing not supported by this signer');
        }
    }
    async executeFetchRequest(tx) {
        const { url, method = 'GET', body, headers = {} } = tx.params;
        if (!url) {
            throw new Error('URL is required for fetch transactions');
        }
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: method !== 'GET' && body ? JSON.stringify(body) : undefined
        });
        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    async waitForTransaction(txHash, confirmations = 1) {
        try {
            const provider = this.ensureProvider();
            const receipt = await provider.waitForTransaction(txHash, confirmations);
            if (!receipt) {
                throw new Error('Transaction receipt not found');
            }
            return {
                status: receipt.status === 1 ? 'success' : 'failed',
                hash: receipt.transactionHash,
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: receipt.blockNumber
            };
        }
        catch (error) {
            return {
                status: 'failed',
                hash: txHash,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async getChainId() {
        const provider = this.ensureProvider();
        const network = await provider.getNetwork();
        return Number(network.chainId);
    }
}
