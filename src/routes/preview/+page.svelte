<script lang="ts">
    import { writable } from 'svelte/store';
    import TransactionModal from '$lib/components/TransactionModal.svelte';
    import type { Transaction, TransactionState } from '$lib/types';
    import { TEST_TRANSACTION_FLOW as mockTransactions } from '$lib/mocks/testTransactionFlow';

    let isOpen = true;
    let theme: 'light' | 'dark' = 'light';
    let showSummary = false;

    // Transaction states store
    const states = writable(new Map<string, TransactionState>([
        ['tx1', { 
            status: 'success',
            hash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234'
        }],
        ['tx2', { 
            status: 'pending'
        }],
        ['tx3', { 
            status: 'pending'
        }],
        ['tx4', { 
            status: 'pending'
        }]
    ]));

    let currentIndex = 1;

    function toggleTheme() {
        theme = theme === 'light' ? 'dark' : 'light';
    }

    function toggleSummary() {
        showSummary = !showSummary;
    }

    function handleExecute(event: CustomEvent<{ transactionId: string }>) {
        const { transactionId } = event.detail;
        
        // Set to processing first
        states.update(currentStates => {
            const newStates = new Map(currentStates);
            newStates.set(transactionId, { 
                status: 'processing'
            });
            return newStates;
        });

        // Then set to success after 2 seconds
        setTimeout(() => {
            states.update(currentStates => {
                const newStates = new Map(currentStates);
                newStates.set(transactionId, { 
                    status: 'success',
                    hash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234'
                });
                return newStates;
            });
        }, 2000);
    }

    function handleChat() {
        alert('Opening chat...');
    }
</script>

<div class="preview-container" class:dark={theme === 'dark'}>
    <div class="controls">
        <button on:click={toggleTheme}>
            Toggle Theme ({theme})
        </button>
        <button on:click={toggleSummary}>
            Toggle Summary
        </button>
    </div>

    <TransactionModal
        {isOpen}
        transactions={mockTransactions}
        states={$states}
        {currentIndex}
        {theme}
        {showSummary}
        title="Borrow 1000 USDC"
        subtitle="Variable Rolling Rate"
        positionsUrl="#positions"
        socialLinks={{
            x: 'https://x.com',
            warpcast: 'https://warpcast.com',
            telegram: 'https://t.me'
        }}
        on:execute={handleExecute}
        on:chat={handleChat}
    />
</div>

<style>
    .preview-container {
        min-height: 100vh;
        padding: 2rem;
        background: #f8fafc;
        transition: background-color 0.3s ease;
    }

    .preview-container.dark {
        background: #0f172a;
    }

    .controls {
        position: fixed;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
        z-index: 1100;
    }

    .controls button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        background: white;
        color: #1a1a1a;
        font-size: 0.875rem;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
    }

    .controls button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    :global(.dark) .controls button {
        background: #1e293b;
        color: white;
    }

    :global(.dark) .controls button:hover {
        background: #2d3748;
    }
</style> 