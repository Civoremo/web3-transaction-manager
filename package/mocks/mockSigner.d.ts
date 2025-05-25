export declare class MockSigner {
    private _shouldFail;
    private _delay;
    constructor(options?: {
        shouldFail?: boolean;
        delay?: number;
    });
    sendTransaction(tx: any): Promise<{
        hash: string;
        wait: () => Promise<{
            hash: string;
            status: number;
        }>;
    }>;
    getAddress(): Promise<string>;
}
