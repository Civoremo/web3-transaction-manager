import * as ethers from 'ethers';
export declare class MockSigner implements ethers.Signer {
    provider: ethers.Provider | null;
    sendTransaction(transaction: ethers.TransactionRequest): Promise<ethers.TransactionResponse>;
    getAddress(): Promise<string>;
    signMessage(message: string | Uint8Array): Promise<string>;
    signTransaction(transaction: ethers.TransactionRequest): Promise<string>;
    signTypedData(domain: ethers.TypedDataDomain, types: Record<string, ethers.TypedDataField[]>, value: Record<string, any>): Promise<string>;
    connect(provider: ethers.Provider): ethers.Signer;
    getNonce(): Promise<number>;
    estimateGas(transaction: ethers.TransactionRequest): Promise<bigint>;
    call(transaction: ethers.TransactionRequest): Promise<string>;
    resolveName(name: string): Promise<string | null>;
    populateCall(transaction: ethers.TransactionRequest): Promise<ethers.TransactionLike<string>>;
    populateTransaction(transaction: ethers.TransactionRequest): Promise<ethers.TransactionLike<string>>;
}
