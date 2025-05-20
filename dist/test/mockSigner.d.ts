import type { Signer, Provider, TransactionRequest, TransactionResponse, TypedDataDomain, TypedDataField, TransactionLike } from 'ethers';
export declare class MockSigner implements Signer {
    provider: Provider | null;
    sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;
    getAddress(): Promise<string>;
    signMessage(message: string | Uint8Array): Promise<string>;
    signTransaction(transaction: TransactionRequest): Promise<string>;
    signTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>): Promise<string>;
    connect(provider: Provider): Signer;
    getNonce(): Promise<number>;
    estimateGas(transaction: TransactionRequest): Promise<bigint>;
    call(transaction: TransactionRequest): Promise<string>;
    resolveName(name: string): Promise<string | null>;
    populateCall(transaction: TransactionRequest): Promise<TransactionLike<string>>;
    populateTransaction(transaction: TransactionRequest): Promise<TransactionLike<string>>;
}
