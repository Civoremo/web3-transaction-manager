export class MockSigner {
  async sendTransaction(tx: any) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (Math.random() < 0.3) {
      throw new Error('Mock transaction failed!');
    }
    return {
      hash: '0xMOCKHASH' + Math.floor(Math.random() * 1000000),
      wait: async () => ({
        hash: '0xMOCKHASH' + Math.floor(Math.random() * 1000000),
        status: 1,
      }),
    };
  }

  async getAddress() {
    return '0xMockAddress';
  }
} 