export class TestMockSigner {
  async sendTransaction(tx: any) {
    // Random delay between 1-3 seconds for testing
    const delay = Math.floor(Math.random() * 2000) + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    // 30% chance of failure for testing
    if (Math.random() < 0.3) {
      throw new Error('Mock transaction failed!');
    }
    
    return {
      hash: '0xTESTHASH' + Math.floor(Math.random() * 1000000),
      wait: async () => ({
        hash: '0xTESTHASH' + Math.floor(Math.random() * 1000000),
        status: 1,
      }),
    };
  }

  async getAddress() {
    return '0xTestAddress';
  }
} 