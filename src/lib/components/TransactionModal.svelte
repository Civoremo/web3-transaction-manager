<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Transaction, TransactionType, TransactionStatus, TransactionState } from '../types';
    import { ethers } from 'ethers';
    import ProgressTracker from './ProgressTracker.svelte';
    import TransactionCard from './TransactionCard.svelte';
    import SummarySection from './SummarySection.svelte';

    export let isOpen = false;
    export let transactions: Transaction[] = [];
    export let signer: ethers.Signer;
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
    export let etherscanBaseUrl = 'https://etherscan.io/tx/';

    const dispatch = createEventDispatcher();

    let states: Map<string, TransactionState> = new Map();
    let currentIndex = 0;
    let processingStartTime = new Map<string, number>();
    let processingDuration = new Map<string, number>();
    let durationInterval: number;
    let autoExecuteInterval: number;

    onMount(() => {
        states = new Map(transactions.map(tx => [tx.id, { status: 'pending' }]));
        currentIndex = 0;
    });

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
        
        // Find the index of this transaction
        const txIndex = transactions.findIndex(tx => tx.id === txId);
        if (txIndex === -1) return false;

        // For the first transaction, it can be executed if pending
        if (txIndex === 0) {
            return state === 'pending';
        }

        // For subsequent transactions:
        // 1. All previous transactions must be successful
        // 2. This transaction must be pending or failed
        const previousTxs = transactions.slice(0, txIndex);
        const allPreviousSuccessful = previousTxs.every(tx => 
            states.get(tx.id)?.status === 'success'
        );

        return (state === 'pending' || state === 'failed') && allPreviousSuccessful;
    }

    function closeModal() {
        isOpen = false;
    }

    async function executeTransaction(transaction: Transaction) {
        if (!signer) {
            const errorMsg = 'No signer provided. Please connect your wallet.';
            console.error(errorMsg);
            states.set(transaction.id, { status: 'failed', error: errorMsg });
            states = new Map(states);
            dispatch('error', { transactionId: transaction.id, error: errorMsg });
            return;
        }
        states.set(transaction.id, { status: 'processing' });
        states = new Map(states);
        try {
            const txResponse = await signer.sendTransaction({
                to: transaction.params.to,
                data: transaction.params.data,
                value: transaction.params.value || '0'
            });
            const receipt = await txResponse.wait();
            states.set(transaction.id, { status: 'success', hash: receipt.hash });
            states = new Map(states);
            dispatch('success', { transactionId: transaction.id, hash: receipt.hash });
            if (currentIndex < transactions.length - 1) {
                currentIndex++;
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            const errorMsg = error?.message || 'Transaction failed';
            states.set(transaction.id, { status: 'failed', error: errorMsg });
            states = new Map(states);
            dispatch('error', { transactionId: transaction.id, error: errorMsg });
        }
    }

    onMount(() => {
        return () => {
            if (durationInterval) clearInterval(durationInterval);
            if (autoExecuteInterval) clearInterval(autoExecuteInterval);
        };
    });

    // Add this computed property to check if all transactions are successful
    $: allTransactionsSuccessful = transactions.length > 0 && transactions.every(tx => states.get(tx.id)?.status === 'success');
</script>

{#if isOpen}
<div 
    class="modal-overlay"
    class:dark={theme === 'dark'}
    on:click={handleClose}
    on:keydown={e => e.key === 'Escape' && handleClose()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
>
    <div 
        class="modal-content"
        on:click|stopPropagation
        on:keydown|stopPropagation
        role="document"
    >
        <header class="modal-header">
            <div class="title-section">
                <h2 id="modal-title">{#if allTransactionsSuccessful}Borrow Successful!{:else}{title}{/if}</h2>
                {#if !allTransactionsSuccessful}
                    <div class="subtitle">{subtitle}</div>
                {/if}
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
            {#if !allTransactionsSuccessful}
                <div class="transaction-list">
                    {#each transactions as transaction (transaction.id)}
                        <div class="transaction-row">
                            <div class="tx-info">{transaction.metadata.title}</div>
                            {#if states.get(transaction.id)?.status === 'success'}
                                <a
                                    href={`${etherscanBaseUrl}${states.get(transaction.id)?.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="action-button success"
                                >
                                    Success ↗
                                </a>
                            {:else if states.get(transaction.id)?.status === 'processing'}
                                <a
                                    href={`${etherscanBaseUrl}${states.get(transaction.id)?.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="action-button processing"
                                >
                                    Pending... ↗
                                </a>
                            {:else if states.get(transaction.id)?.status === 'failed'}
                                <button class="action-button error" on:click={() => executeTransaction(transaction)}>
                                    Retry
                                </button>
                            {:else if transaction.id === transactions[currentIndex]?.id}
                                <button class="action-button active" on:click={() => executeTransaction(transaction)}>
                                    {transaction.metadata.buttonLabel}
                                </button>
                            {:else}
                                <button class="action-button disabled">{transaction.metadata.buttonLabel}</button>
                            {/if}
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="success-screen">
                    <p class="success-message">
                        Head to the <a href={positionsUrl}>Positions</a> page to track and manage your new position.
                    </p>
                    <div class="social-links">
                        <button class="social-button" on:click={() => window.open(socialLinks.x, '_blank')}>Follow on X</button>
                        <button class="social-button" on:click={() => window.open(socialLinks.warpcast, '_blank')}>Follow on Warpcast</button>
                        <button class="social-button" on:click={() => window.open(socialLinks.telegram, '_blank')}>Follow on Telegram</button>
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
        inset: 0;
        background: rgba(30, 41, 59, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        width: 480px;
        padding: 32px;
        border-radius: 16px;
        background: white;
        box-shadow: 0 8px 32px rgba(16, 30, 54, 0.12);
        position: relative;
    }

    .modal-header {
        margin-bottom: 24px;
        text-align: left;
        position: relative;
    }

    .title-section {
        text-align: center;
        flex: 1;
    }

    h2 {
        font-size: 24px;
        font-weight: 600;
        color: #111827;
    }

    .subtitle {
        font-size: 16px;
        color: #6B7280;
        margin-top: 4px;
    }

    .close-button {
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        border: none;
        font-size: 24px;
        color: #9CA3AF;
        cursor: pointer;
    }

    .modal-body {
        padding: 1rem;
    }

    .transaction-list {
        margin-bottom: 0;
    }

    .transaction-row {
        background: #F7F7FA;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tx-info {
        font-size: 16px;
        color: #111827;
        font-weight: 500;
    }

    .action-button {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        outline: none;
        transition: all 0.2s;
        min-width: 90px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-decoration: none;
    }

    .action-button.active {
        background: #4F7FFF;
        color: white;
    }

    .action-button.active:hover {
        background: #3B66E5;
    }

    .action-button.disabled {
        background: rgba(79, 127, 255, 0.1);
        color: #4F7FFF;
        cursor: not-allowed;
        opacity: 1;
    }

    .action-button.processing {
        background: #4F7FFF;
        color: white;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .action-button.processing:hover {
        background: #3B66E5;
    }

    .action-button.success {
        background: white;
        color: #64748B;
        border: 1px solid #E2E8F0;
        padding-right: 12px;
    }

    .action-button.success:hover {
        background: #F8FAFC;
    }

    .action-button.error {
        background: #DC2626;
        color: white;
        cursor: pointer;
    }

    .action-button.error:hover {
        background: #B91C1C;
    }

    .error-icon {
        font-size: 1rem;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .link-icon {
        font-size: 1rem;
        margin-left: 0.25rem;
    }

    .success-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 2rem 0;
        margin-top: -1rem;
    }

    .success-message {
        font-size: 16px;
        line-height: 24px;
        color: #64748B;
        margin: 24px 0 32px;
        font-weight: 400;
    }

    .success-message a {
        color: #4F7FFF;
        text-decoration: none;
        font-weight: 500;
    }

    .success-message a:hover {
        text-decoration: underline;
    }

    .social-links {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        padding: 0 32px;
        max-width: 280px;
        margin: 0 auto;
    }

    .social-button {
        width: 100%;
        padding: 10px 16px;
        border: 1px solid #E2E8F0;
        border-radius: 100px;
        background: white;
        color: #334155;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
        text-align: center;
        min-width: 200px;
        white-space: nowrap;
    }

    .social-button:hover {
        background: #F8FAFC;
        border-color: #CBD5E1;
    }

    :global(.dark) .social-button {
        background: #1F2937;
        border-color: #374151;
        color: #E5E7EB;
    }

    :global(.dark) .social-button:hover {
        background: #374151;
        border-color: #4B5563;
    }

    .modal-footer {
        margin-top: 32px;
        text-align: center;
    }

    .help-text {
        font-size: 14px;
        color: #64748B;
        font-weight: 400;
    }

    .chat-link {
        background: none;
        border: none;
        color: #4F7FFF;
        padding: 0;
        font-size: inherit;
        font-weight: 400;
        cursor: pointer;
    }

    .chat-link:hover {
        text-decoration: underline;
    }

    /* Dark theme */
    .dark .modal-content {
        background: #1F2937;
    }

    .dark h2 {
        color: white;
    }

    .dark .subtitle,
    .dark .help-text {
        color: #9CA3AF;
    }

    .dark .transaction-row {
        background: #374151;
    }

    .dark .tx-info {
        color: white;
    }

    .dark .action-button.disabled {
        background: rgba(79, 127, 255, 0.1);
        color: #4F7FFF;
    }

    .dark .action-button.processing {
        background: #4F7FFF;
        color: white;
    }

    .dark .action-button.success {
        background: #1F2937;
        border-color: #374151;
        color: #9CA3AF;
    }

    .dark .action-button.success:hover {
        background: #374151;
    }

    .dark .close-button {
        color: #9CA3AF;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style> 