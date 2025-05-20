<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Transaction, TransactionState } from '../types';
    import ProgressTracker from './ProgressTracker.svelte';
    import TransactionCard from './TransactionCard.svelte';
    import SummarySection from './SummarySection.svelte';

    export let isOpen = false;
    export let transactions: Transaction[] = [];
    export let states: Map<string, TransactionState>;
    export let currentIndex: number;
    export let theme: 'light' | 'dark' = 'light';
    export let showSummary = false;
    export let autoExecuteAfterApproval = false;
    export let title = 'Borrow 1000 USDC';
    export let subtitle = 'Variable Rolling Rate';
    export let positionsUrl = '#';
    export let socialLinks = {
        x: 'https://x.com',
        warpcast: 'https://warpcast.com',
        telegram: 'https://t.me'
    };

    const dispatch = createEventDispatcher<{
        close: void;
        execute: { transactionId: string };
        retry: { transactionId: string };
        skip: { transactionId: string };
        cancel: void;
        chat: void;
    }>();

    let processingStartTime = new Map<string, number>();
    let processingDuration = new Map<string, number>();
    let durationInterval: number;
    let autoExecuteInterval: number;

    // Update processing durations every second
    function updateDurations() {
        const now = Date.now();
        processingDuration = new Map(
            Array.from(processingStartTime.entries()).map(([txId, startTime]) => [
                txId,
                Math.floor((now - startTime) / 1000)
            ])
        );
    }

    function checkAutoExecute() {
        if (!autoExecuteAfterApproval) return;
        
        const currentTx = transactions[currentIndex];
        if (!currentTx) return;

        // Get the first transaction's state
        const firstTxState = states.get(transactions[0].id)?.status;
        const currentTxState = states.get(currentTx.id)?.status;
        
        // Only auto-execute if:
        // 1. First transaction is successful (user approved)
        // 2. Current transaction is pending
        // 3. No other transaction is processing
        const isProcessing = Array.from(states.values()).some(state => state.status === 'processing');
        if (firstTxState === 'success' && 
            currentTxState === 'pending' && 
            !isProcessing) {
            handleExecute(currentTx.id);
        }
    }

    function handleClose() {
        if (autoExecuteInterval) clearInterval(autoExecuteInterval);
        dispatch('close');
    }

    function handleExecute(transactionId: string) {
        processingStartTime.set(transactionId, Date.now());
        processingDuration.set(transactionId, 0);
        dispatch('execute', { transactionId });
    }

    function handleRetry(transactionId: string) {
        processingStartTime.delete(transactionId);
        processingDuration.delete(transactionId);
        handleExecute(transactionId);
    }

    function handleSkip(transactionId: string) {
        dispatch('skip', { transactionId });
    }

    function handleCancel() {
        if (autoExecuteInterval) clearInterval(autoExecuteInterval);
        autoExecuteAfterApproval = false;
        dispatch('cancel');
    }

    function handleChat() {
        dispatch('chat');
    }

    function toggleAutoExecute() {
        autoExecuteAfterApproval = !autoExecuteAfterApproval;
        if (autoExecuteAfterApproval) {
            autoExecuteInterval = setInterval(checkAutoExecute, 2000);
        } else if (autoExecuteInterval) {
            clearInterval(autoExecuteInterval);
        }
    }

    $: currentTransaction = transactions[currentIndex];
    $: isComplete = currentIndex >= transactions.length;
    $: hasError = transactions.some(tx => states.get(tx.id)?.status === 'failed');
    $: hasPending = transactions.some(tx => states.get(tx.id)?.status === 'pending');

    // Watch for state changes to trigger auto-execute
    $: {
        if (states && currentTransaction) {
            checkAutoExecute();
        }
    }

    // Start/stop intervals based on modal visibility
    $: if (isOpen) {
        durationInterval = setInterval(updateDurations, 1000);
        if (autoExecuteAfterApproval) {
            autoExecuteInterval = setInterval(checkAutoExecute, 2000);
        }
    } else {
        if (durationInterval) clearInterval(durationInterval);
        if (autoExecuteInterval) clearInterval(autoExecuteInterval);
        processingStartTime = new Map();
        processingDuration = new Map();
    }

    function canExecute(txId: string): boolean {
        const state = states.get(txId)?.status;
        if (!state) return false;
        
        // Can only execute if:
        // 1. This transaction is pending AND
        // 2. Either this is the first transaction OR the previous one was successful
        const isFirst = transactions[0].id === txId;
        const previousTxId = isFirst ? null : transactions[currentIndex - 1]?.id;
        const previousTxSuccess = previousTxId ? states.get(previousTxId)?.status === 'success' : true;
        
        return state === 'pending' && (isFirst || previousTxSuccess);
    }

    onMount(() => {
        return () => {
            if (durationInterval) clearInterval(durationInterval);
            if (autoExecuteInterval) clearInterval(autoExecuteInterval);
        };
    });
</script>

{#if isOpen}
<div 
    class="modal-overlay"
    class:dark={theme === 'dark'}
    on:click={handleClose}
>
    <div 
        class="modal-content"
        on:click|stopPropagation
    >
        <header class="modal-header">
            <div class="title-section">
                <h2>{title}</h2>
                <div class="subtitle">{subtitle}</div>
            </div>
            <button 
                class="close-button"
                on:click={handleClose}
                aria-label="Close modal"
            >
                ×
            </button>
        </header>

        <div class="modal-body">
            {#if !showSummary}
                <div class="transaction-list">
                    {#each transactions as tx}
                        {@const state = states.get(tx.id)}
                        <div class="transaction-row">
                            <div class="tx-info">{tx.metadata?.title}</div>
                            <button 
                                class="action-button"
                                class:pending={state?.status === 'pending'}
                                class:processing={state?.status === 'processing'}
                                class:success={state?.status === 'success'}
                                disabled={!canExecute(tx.id)}
                                on:click={() => handleExecute(tx.id)}
                            >
                                {#if state?.status === 'processing'}
                                    <span class="spinner"></span>
                                    Pending...
                                {:else if state?.status === 'success'}
                                    Success <span class="success-icon">✓</span>
                                {:else if state?.status === 'failed'}
                                    <span class="error-icon">✗</span>
                                    Retry
                                {:else}
                                    {tx.metadata?.actionLabel || 'Approve'}
                                {/if}
                            </button>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="success-screen">
                    <h2>Borrow Successful!</h2>
                    
                    <p class="success-message">
                        Head to the <a href={positionsUrl}>Positions</a> page to track and manage your new position.
                    </p>
                    
                    <div class="social-links">
                        <button class="social-button" on:click={() => window.open(socialLinks.x)}>
                            Follow on X
                        </button>
                        <button class="social-button" on:click={() => window.open(socialLinks.warpcast)}>
                            Follow on Warpcast
                        </button>
                        <button class="social-button" on:click={() => window.open(socialLinks.telegram)}>
                            Follow on Telegram
                        </button>
                    </div>
                </div>
            {/if}
        </div>

        <footer class="modal-footer">
            <div class="help-text">
                Need help or have feedback? <button class="chat-link" on:click={handleChat}>Chat with someone</button>.
            </div>
        </footer>
    </div>
</div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    .modal-header {
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
    }

    .title-section {
        text-align: center;
        flex: 1;
    }

    h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        color: #1a1a1a;
    }

    .subtitle {
        font-size: 0.875rem;
        color: #666;
        margin-top: 0.25rem;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #666;
        cursor: pointer;
        padding: 0.5rem;
        margin: -0.5rem;
        position: absolute;
        right: 1rem;
    }

    .modal-body {
        padding: 1rem;
    }

    .transaction-list {
        padding: 0.5rem;
    }

    .transaction-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8f9fe;
        border-radius: 12px;
        margin-bottom: 0.75rem;
    }

    .tx-info {
        font-size: 0.9375rem;
        color: #1a1a1a;
    }

    .action-button {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
    }

    .action-button:not(:disabled) {
        background: #2461ff;
        color: white;
    }

    .action-button:disabled {
        background: #e8eaf2;
        color: #666;
        cursor: not-allowed;
    }

    .action-button.success {
        background: #f8f9fe;
        color: #666;
        cursor: default;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .success-screen {
        padding: 2rem;
        text-align: center;
    }

    .success-message {
        color: #666;
        margin: 1rem 0 2rem;
    }

    .success-message a {
        color: #2461ff;
        text-decoration: none;
    }

    .social-links {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .social-button {
        padding: 0.75rem;
        border: 1px solid #e8eaf2;
        border-radius: 8px;
        background: white;
        color: #1a1a1a;
        font-size: 0.9375rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .social-button:hover {
        background: #f8f9fe;
    }

    .modal-footer {
        padding: 1rem;
        text-align: center;
        border-top: 1px solid #f0f0f0;
    }

    .help-text {
        font-size: 0.875rem;
        color: #666;
    }

    .chat-link {
        background: none;
        border: none;
        color: #2461ff;
        padding: 0;
        font-size: inherit;
        cursor: pointer;
    }

    /* Dark theme */
    .dark .modal-content {
        background: #1a1a1a;
    }

    .dark h2 {
        color: #fff;
    }

    .dark .subtitle,
    .dark .help-text {
        color: #999;
    }

    .dark .modal-header,
    .dark .modal-footer {
        border-color: #333;
    }

    .dark .transaction-row {
        background: #2a2a2a;
    }

    .dark .tx-info {
        color: #fff;
    }

    .dark .action-button:disabled {
        background: #333;
        color: #999;
    }

    .dark .action-button.success {
        background: #2a2a2a;
        color: #999;
    }

    .dark .social-button {
        background: #1a1a1a;
        border-color: #333;
        color: #fff;
    }

    .dark .social-button:hover {
        background: #2a2a2a;
    }

    .dark .success-message {
        color: #999;
    }

    .dark .close-button {
        color: #999;
    }
</style> 