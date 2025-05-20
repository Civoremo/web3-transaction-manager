import { BrowserProvider, Contract, JsonRpcSigner, TransactionResponse } from 'ethers';
export class Web3Service {
    provider = null;
    signer = null;
    async connect() {
        if (!window.ethereum) {
            throw new Error('No Web3 provider found. Please install MetaMask.');
        }
        this.provider = new BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
    }
    async disconnect() {
        this.provider = null;
        this.signer = null;
    }
    async sendTransaction(tx) {
        if (!this.signer) {
            throw new Error('No signer available. Please connect first.');
        }
        const txParams = {
            to: tx.params.to,
            data: tx.params.data || '0x',
            value: tx.params.value ? tx.params.value : '0',
            gasLimit: tx.params.gasLimit,
            gasPrice: tx.params.gasPrice
        };
        return await this.signer.sendTransaction(txParams);
    }
    async estimateGas(tx) {
        if (!this.provider) {
            throw new Error('No provider available. Please connect first.');
        }
        const txParams = {
            to: tx.params.to,
            data: tx.params.data || '0x',
            value: tx.params.value ? tx.params.value : '0'
        };
        return await this.provider.estimateGas(txParams);
    }
    async waitForTransaction(txHash, confirmations = 1) {
        if (!this.provider) {
            throw new Error('No provider available. Please connect first.');
        }
        try {
            const receipt = await this.provider.waitForTransaction(txHash, confirmations);
            if (!receipt) {
                throw new Error('Transaction receipt not found');
            }
            return {
                status: receipt.status === 1 ? 'success' : 'failed',
                hash: receipt.hash,
                gasUsed: receipt.gasUsed,
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
        if (!this.provider) {
            throw new Error('No provider available. Please connect first.');
        }
        const network = await this.provider.getNetwork();
        return Number(network.chainId);
    }
    async switchNetwork(chainId) {
        if (!window.ethereum) {
            throw new Error('No Web3 provider found. Please install MetaMask.');
        }
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }]
            });
        }
        catch (error) {
            throw new Error(`Failed to switch network: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
