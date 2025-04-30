<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Transaction, TransactionState } from '../types';
    import ProgressTracker from './ProgressTracker.svelte';
    import TransactionCard from './TransactionCard.svelte';
    import SummarySection from './SummarySection.svelte';

    export let isOpen = false;
    export let transactions: Transaction[] = [];
    export let states: Map<string, TransactionState>;
    export let currentIndex: number;
    export let theme: 'light' | 'dark' = 'light';

    const dispatch = createEventDispatcher<{
        close: void;
        execute: { transactionId: string };
        retry: { transactionId: string };
    }>();

    function handleClose() {
        dispatch('close');
    }

    function handleExecute(transactionId: string) {
        dispatch('execute', { transactionId });
    }

    function handleRetry(transactionId: string) {
        dispatch('retry', { transactionId });
    }

    $: currentTransaction = transactions[currentIndex];
    $: isComplete = currentIndex >= transactions.length;
    $: hasError = transactions.some(tx => states.get(tx.id)?.status === 'failed');
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

            {#if currentTransaction && !isComplete}
                <TransactionCard
                    transaction={currentTransaction}
                    state={states.get(currentTransaction.id)}
                    onExecute={() => handleExecute(currentTransaction.id)}
                    onRetry={() => handleRetry(currentTransaction.id)}
                />
            {/if}

            <SummarySection
                {transactions}
                {states}
                {isComplete}
                {hasError}
            />
        </div>

        <footer class="modal-footer">
            {#if isComplete && !hasError}
                <div class="success-message">All transactions completed successfully!</div>
            {:else if hasError}
                <div class="error-message">Some transactions failed. Please retry failed transactions.</div>
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
</style> 