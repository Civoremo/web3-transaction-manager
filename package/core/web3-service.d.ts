import * as ethers from 'ethers';
import type { Transaction, TransactionState } from '../types';
export declare class Web3Service {
    private signer;
    private provider;
    constructor(signer: ethers.JsonRpcSigner);
    sendTransaction(tx: Transaction): Promise<ethers.TransactionResponse>;
    estimateGas(tx: Transaction): Promise<ethers.BigNumberish>;
    waitForTransaction(txHash: string, confirmations?: number): Promise<TransactionState>;
    getChainId(): Promise<number>;
}
