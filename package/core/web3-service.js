import * as ethers from 'ethers';
export class Web3Service {
    signer;
    provider;
    constructor(signer) {
        this.signer = signer;
        this.provider = signer.provider;
    }
    async sendTransaction(tx) {
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
        const txParams = {
            to: tx.params.to,
            data: tx.params.data || '0x',
            value: tx.params.value ? tx.params.value : '0'
        };
        return await this.provider.estimateGas(txParams);
    }
    async waitForTransaction(txHash, confirmations = 1) {
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
        const network = await this.provider.getNetwork();
        return Number(network.chainId);
    }
}
