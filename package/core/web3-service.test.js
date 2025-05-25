import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Web3Service } from './web3-service';
describe('Web3Service', () => {
    let web3Service;
    beforeEach(() => {
        web3Service = new Web3Service();
    });
    describe('connect', () => {
        it('should connect to MetaMask', async () => {
            await web3Service.connect();
            expect(window.ethereum?.request).toHaveBeenCalled();
        });
        it('should throw error if no provider', async () => {
            // Temporarily remove ethereum from window
            const ethereum = window.ethereum;
            // @ts-ignore
            delete window.ethereum;
            await expect(web3Service.connect()).rejects.toThrow('No Web3 provider found');
            // Restore ethereum
            window.ethereum = ethereum;
        });
    });
    describe('sendTransaction', () => {
        const mockTx = {
            id: '1',
            type: 'standard',
            params: {
                to: '0x123',
                value: '1000000000000000000', // 1 ETH
                data: '0x'
            }
        };
        it('should throw error if not connected', async () => {
            await expect(web3Service.sendTransaction(mockTx)).rejects.toThrow('No signer available');
        });
        it('should send transaction successfully', async () => {
            await web3Service.connect();
            await web3Service.sendTransaction(mockTx);
            expect(window.ethereum?.request).toHaveBeenCalledWith(expect.objectContaining({
                method: 'eth_sendTransaction'
            }));
        });
    });
    describe('estimateGas', () => {
        const mockTx = {
            id: '1',
            type: 'standard',
            params: {
                to: '0x123',
                value: '1000000000000000000'
            }
        };
        it('should throw error if not connected', async () => {
            await expect(web3Service.estimateGas(mockTx)).rejects.toThrow('No provider available');
        });
        it('should estimate gas successfully', async () => {
            await web3Service.connect();
            await web3Service.estimateGas(mockTx);
            expect(window.ethereum?.request).toHaveBeenCalledWith(expect.objectContaining({
                method: 'eth_estimateGas'
            }));
        });
    });
    describe('waitForTransaction', () => {
        it('should throw error if not connected', async () => {
            await expect(web3Service.waitForTransaction('0x123')).rejects.toThrow('No provider available');
        });
        it('should wait for transaction successfully', async () => {
            await web3Service.connect();
            const mockReceipt = {
                status: 1,
                hash: '0x123',
                gasUsed: BigInt(21000),
                blockNumber: 123456
            };
            // Mock the provider's waitForTransaction method
            window.ethereum?.request.mockImplementationOnce(() => Promise.resolve(mockReceipt));
            const result = await web3Service.waitForTransaction('0x123');
            expect(result.status).toBe('success');
            expect(result.hash).toBe('0x123');
        });
        it('should handle failed transactions', async () => {
            await web3Service.connect();
            const mockReceipt = {
                status: 0,
                hash: '0x123',
                gasUsed: BigInt(21000),
                blockNumber: 123456
            };
            window.ethereum?.request.mockImplementationOnce(() => Promise.resolve(mockReceipt));
            const result = await web3Service.waitForTransaction('0x123');
            expect(result.status).toBe('failed');
        });
    });
});
