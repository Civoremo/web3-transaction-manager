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

    const dispatch = createEventDispatcher<{
        close: void;
        execute: { transactionId: string };
        retry: { transactionId: string };
        skip: { transactionId: string };
        cancel: void;
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
        // Clear any existing timers/state for this transaction
        processingStartTime.delete(transactionId);
        processingDuration.delete(transactionId);
        
        // Dispatch retry event first to let parent component update state
        dispatch('retry', { transactionId });
    }

    function handleSkip(transactionId: string) {
        dispatch('skip', { transactionId });
    }

    function handleCancel() {
        if (autoExecuteInterval) clearInterval(autoExecuteInterval);
        autoExecuteAfterApproval = false;
        dispatch('cancel');
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
            <h2>Transaction Progress</h2>
            <button 
                class="close-button"
                on:click={handleClose}
                aria-label="Close modal"
            >
                ×
            </button>
        </header>

        <div class="modal-body">
            <ProgressTracker
                {transactions}
                {states}
                {currentIndex}
            />

            {#if currentTransaction && !showSummary}
                <div class="transaction-container">
                    <TransactionCard
                        transaction={currentTransaction}
                        state={states.get(currentTransaction.id)}
                        onExecute={() => handleExecute(currentTransaction.id)}
                        onRetry={() => handleRetry(currentTransaction.id)}
                    />
                    {#if states.get(currentTransaction.id)?.status === 'processing'}
                        <div class="processing-overlay">
                            <div class="spinner"></div>
                            <div class="duration">
                                Processing... ({processingDuration.get(currentTransaction.id) || 0}s)
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="action-buttons">
                    {#if currentIndex === 0 && states.get(currentTransaction.id)?.status === 'pending'}
                        <div class="auto-execute-toggle">
                            <label>
                                <input 
                                    type="checkbox" 
                                    bind:checked={autoExecuteAfterApproval}
                                    on:change={toggleAutoExecute}
                                >
                                Auto-execute remaining transactions after approval
                            </label>
                        </div>
                    {/if}
                    {#if states.get(currentTransaction.id)?.status === 'failed'}
                        <button 
                            class="skip-button"
                            on:click={() => handleSkip(currentTransaction.id)}
                        >
                            Skip Transaction
                        </button>
                    {/if}
                    {#if hasPending}
                        <button 
                            class="cancel-button"
                            on:click={handleCancel}
                        >
                            Cancel All Pending
                        </button>
                    {/if}
                </div>
            {/if}

            {#if showSummary}
                <SummarySection
                    {transactions}
                    {states}
                    isComplete={true}
                    {hasError}
                />
            {/if}
        </div>

        <footer class="modal-footer">
            {#if showSummary && !hasError}
                <div class="success-message">All transactions completed successfully!</div>
            {:else if showSummary && hasError}
                <div class="error-message">Some transactions were skipped or failed. Check the summary above for details.</div>
            {:else if autoExecuteAfterApproval}
                <div class="info-message">Transactions will execute automatically after approval</div>
            {/if}
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
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .dark .modal-content {
        background: #1a1a1a;
        color: #fff;
    }

    .modal-header {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dark .modal-header {
        border-color: #333;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        color: #666;
        transition: color 0.2s;
    }

    .dark .close-button {
        color: #999;
    }

    .close-button:hover {
        color: #000;
    }

    .dark .close-button:hover {
        color: #fff;
    }

    .modal-body {
        padding: 1rem;
    }

    .modal-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        text-align: center;
    }

    .dark .modal-footer {
        border-color: #333;
    }

    .success-message {
        color: #4CAF50;
        font-weight: 500;
    }

    .error-message {
        color: #f44336;
        font-weight: 500;
    }

    .dark .success-message {
        color: #81c784;
    }

    .dark .error-message {
        color: #e57373;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
        .modal-content {
            width: 95%;
            max-height: 95vh;
            margin: 1rem;
        }

        .modal-header h2 {
            font-size: 1.1rem;
        }

        .modal-body {
            padding: 0.75rem;
        }
    }

    .transaction-container {
        position: relative;
        margin: 1rem 0;
    }

    .processing-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        border-radius: 8px;
    }

    .dark .processing-overlay {
        background: rgba(0, 0, 0, 0.8);
    }

    .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #4CAF50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .dark .spinner {
        border-color: #333;
        border-top-color: #4CAF50;
    }

    .duration {
        font-size: 0.9rem;
        color: #666;
    }

    .dark .duration {
        color: #ccc;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: flex-end;
    }

    .skip-button,
    .cancel-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s;
    }

    .skip-button {
        background: #ff9800;
        color: white;
    }

    .skip-button:hover {
        background: #f57c00;
    }

    .cancel-button {
        background: #f44336;
        color: white;
    }

    .cancel-button:hover {
        background: #d32f2f;
    }

    .dark .skip-button {
        background: #ff9800;
    }

    .dark .skip-button:hover {
        background: #f57c00;
    }

    .dark .cancel-button {
        background: #f44336;
    }

    .dark .cancel-button:hover {
        background: #d32f2f;
    }

    .auto-execute-toggle {
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: #f5f5f5;
        border-radius: 4px;
    }

    .dark .auto-execute-toggle {
        background: #2a2a2a;
    }

    .auto-execute-toggle label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        color: #666;
    }

    .dark .auto-execute-toggle label {
        color: #aaa;
    }

    .info-message {
        color: #2196F3;
        font-size: 0.9rem;
        text-align: center;
    }

    .dark .info-message {
        color: #64B5F6;
    }
</style> 