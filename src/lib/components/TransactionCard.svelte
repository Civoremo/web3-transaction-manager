<script lang="ts">
    import type { Transaction, TransactionState } from '../types';

    export let transaction: Transaction;
    export let state: TransactionState | undefined;
    export let onExecute: () => void;
    export let onRetry: () => void;

    $: isProcessing = state?.status === 'processing';
    $: isSuccess = state?.status === 'success';
    $: isFailed = state?.status === 'failed';
    $: isPending = state?.status === 'pending';
    $: statusText = getStatusText(state?.status);
    $: buttonText = getButtonText(state?.status);

    function getStatusText(status: TransactionState['status'] | undefined): string {
        switch (status) {
            case 'pending': return 'Waiting to start';
            case 'processing': return 'Processing...';
            case 'success': return 'Completed';
            case 'failed': return 'Failed';
            case 'cancelled': return 'Cancelled';
            default: return 'Unknown';
        }
    }

    function getButtonText(status: TransactionState['status'] | undefined): string {
        switch (status) {
            case 'pending': return 'Execute';
            case 'processing': return 'Processing...';
            case 'failed': return 'Retry';
            default: return '';
        }
    }

    function handleAction() {
        if (isFailed) {
            onRetry();
        } else if (isPending) {
            onExecute();
        }
    }
</script>

<div class="transaction-card" class:processing={isProcessing}>
    <div class="card-header">
        <h3>{transaction.metadata?.title || 'Transaction'}</h3>
        <div class="status-badge" class:success={isSuccess} class:failed={isFailed}>
            {statusText}
        </div>
    </div>

    <div class="card-body">
        <p class="description">
            {transaction.metadata?.description || 'No description provided'}
        </p>

        <div class="transaction-details">
            <div class="detail-row">
                <span class="label">To:</span>
                <span class="value">{transaction.params.to}</span>
            </div>
            {#if transaction.params.value}
                <div class="detail-row">
                    <span class="label">Value:</span>
                    <span class="value">{transaction.params.value} ETH</span>
                </div>
            {/if}
            {#if state?.gasUsed}
                <div class="detail-row">
                    <span class="label">Gas Used:</span>
                    <span class="value">{state.gasUsed.toString()}</span>
                </div>
            {/if}
            {#if state?.error}
                <div class="error-message">
                    {state.error}
                </div>
            {/if}
        </div>
    </div>

    {#if buttonText}
        <div class="card-footer">
            <button
                class="action-button"
                class:processing={isProcessing}
                on:click={handleAction}
                disabled={isProcessing}
            >
                {buttonText}
            </button>
        </div>
    {/if}
</div>

<style>
    .transaction-card {
        background: white;
        border-radius: 8px;
        border: 1px solid #eee;
        margin: 1rem 0;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .transaction-card.processing {
        border-color: #2196F3;
        box-shadow: 0 0 0 1px #2196F3;
    }

    .card-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }

    .card-header h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        background: #eee;
    }

    .status-badge.success {
        background: #4CAF50;
        color: white;
    }

    .status-badge.failed {
        background: #f44336;
        color: white;
    }

    .card-body {
        padding: 1rem;
    }

    .description {
        margin: 0 0 1rem;
        color: #666;
        font-size: 0.875rem;
    }

    .transaction-details {
        font-size: 0.875rem;
    }

    .detail-row {
        display: flex;
        margin-bottom: 0.5rem;
    }

    .label {
        width: 80px;
        color: #666;
    }

    .value {
        flex: 1;
        word-break: break-all;
    }

    .error-message {
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: #ffebee;
        color: #f44336;
        border-radius: 4px;
        font-size: 0.875rem;
    }

    .card-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        text-align: right;
    }

    .action-button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        background: #2196F3;
        color: white;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .action-button:hover:not(:disabled) {
        background: #1976D2;
    }

    .action-button:disabled {
        background: #90CAF9;
        cursor: not-allowed;
    }

    .action-button.processing {
        background: #90CAF9;
        cursor: not-allowed;
    }

    /* Dark theme support */
    :global(.dark) .transaction-card {
        background: #2d2d2d;
        border-color: #333;
    }

    :global(.dark) .card-header {
        border-color: #333;
    }

    :global(.dark) .description {
        color: #999;
    }

    :global(.dark) .label {
        color: #999;
    }

    :global(.dark) .error-message {
        background: #311b1b;
        color: #e57373;
    }

    :global(.dark) .card-footer {
        border-color: #333;
    }
</style> 