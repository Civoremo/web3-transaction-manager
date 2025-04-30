<script lang="ts">
    import type { Transaction, TransactionState } from '../types';
    import { formatEther } from 'ethers';

    export let transactions: Transaction[] = [];
    export let states: Map<string, TransactionState>;
    export let isComplete = false;
    export let hasError = false;

    $: completedTransactions = transactions.filter(tx => 
        states.get(tx.id)?.status === 'success'
    );

    $: failedTransactions = transactions.filter(tx => 
        states.get(tx.id)?.status === 'failed'
    );

    $: pendingTransactions = transactions.filter(tx => 
        states.get(tx.id)?.status === 'pending' || 
        states.get(tx.id)?.status === 'processing'
    );

    $: totalGasUsed = completedTransactions.reduce((total, tx) => {
        const gasUsed = states.get(tx.id)?.gasUsed;
        return gasUsed ? total + BigInt(gasUsed.toString()) : total;
    }, BigInt(0));

    $: totalValue = transactions.reduce((total, tx) => {
        const value = tx.params.value;
        return value ? total + BigInt(value) : total;
    }, BigInt(0));
</script>

<div class="summary-section">
    <h3>Transaction Summary</h3>
    
    <div class="summary-grid">
        <div class="summary-item">
            <span class="label">Total Transactions</span>
            <span class="value">{transactions.length}</span>
        </div>
        
        <div class="summary-item">
            <span class="label">Completed</span>
            <span class="value success">{completedTransactions.length}</span>
        </div>
        
        <div class="summary-item">
            <span class="label">Failed</span>
            <span class="value error">{failedTransactions.length}</span>
        </div>
        
        <div class="summary-item">
            <span class="label">Pending</span>
            <span class="value">{pendingTransactions.length}</span>
        </div>
    </div>

    {#if totalValue > 0}
        <div class="detail-row">
            <span class="label">Total Value</span>
            <span class="value">{formatEther(totalValue)} ETH</span>
        </div>
    {/if}

    {#if totalGasUsed > 0}
        <div class="detail-row">
            <span class="label">Total Gas Used</span>
            <span class="value">{totalGasUsed.toString()}</span>
        </div>
    {/if}

    {#if isComplete}
        <div class="completion-status" class:has-error={hasError}>
            {#if hasError}
                <p>Some transactions failed. Please check the details above and retry failed transactions.</p>
            {:else}
                <p>All transactions completed successfully!</p>
            {/if}
        </div>
    {/if}
</div>

<style>
    .summary-section {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
    }

    h3 {
        margin: 0 0 1rem;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0.5rem;
        background: white;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .label {
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 0.25rem;
    }

    .value {
        font-size: 1.25rem;
        font-weight: 500;
    }

    .value.success {
        color: #4CAF50;
    }

    .value.error {
        color: #f44336;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: white;
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }

    .completion-status {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 4px;
        background: #E8F5E9;
        color: #2E7D32;
        text-align: center;
    }

    .completion-status.has-error {
        background: #FFEBEE;
        color: #C62828;
    }

    .completion-status p {
        margin: 0;
        font-weight: 500;
    }

    /* Dark theme support */
    :global(.dark) .summary-section {
        background: #2d2d2d;
    }

    :global(.dark) .summary-item {
        background: #333;
    }

    :global(.dark) .label {
        color: #999;
    }

    :global(.dark) .detail-row {
        background: #333;
    }

    :global(.dark) .completion-status {
        background: #1B5E20;
        color: #81C784;
    }

    :global(.dark) .completion-status.has-error {
        background: #B71C1C;
        color: #E57373;
    }

    /* Responsive Design */
    @media (max-width: 480px) {
        .summary-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .value {
            font-size: 1.1rem;
        }
    }
</style> 