export class MockSigner {
  private _shouldFail = false;
  private _delay = 0;

  constructor(options?: { shouldFail?: boolean; delay?: number }) {
    this._shouldFail = options?.shouldFail ?? false;
    this._delay = options?.delay ?? 0;
  }

  async sendTransaction(tx: any) {
    if (this._delay) {
      await new Promise((resolve) => setTimeout(resolve, this._delay));
    }
    
    if (this._shouldFail) {
      throw new Error('Transaction failed');
    }
    
    return {
      hash: '0xMOCKHASH',
      wait: async () => ({
        hash: '0xMOCKHASH',
        status: 1,
      }),
    };
  }

  async getAddress() {
    return '0xMockAddress';
  }
} 