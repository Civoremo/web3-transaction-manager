<script>export let transactions = [];
export let states;
export let isComplete = false;
export let hasError = false;
export let explorerBaseUrl = "https://etherscan.io/tx/";
$: completedTransactions = transactions.filter(
  (tx) => states.get(tx.id)?.status === "success"
);
$: failedTransactions = transactions.filter(
  (tx) => states.get(tx.id)?.status === "failed"
);
$: pendingTransactions = transactions.filter(
  (tx) => states.get(tx.id)?.status === "pending" || states.get(tx.id)?.status === "processing"
);
$: totalGasUsed = completedTransactions.reduce((total, tx) => {
  const gasUsed = states.get(tx.id)?.gasUsed;
  return gasUsed ? total + BigInt(gasUsed.toString()) : total;
}, BigInt(0));
function getStatusIcon(status) {
  switch (status) {
    case "success":
      return "\u2713";
    case "failed":
      return "\u2717";
    case "skipped":
      return "\u2933";
    case "cancelled":
      return "\u2A2F";
    case "processing":
      return "\u2022";
    default:
      return "\u25CB";
  }
}
function formatTxHash(hash) {
  if (!hash) return "";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}
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

    {#if totalGasUsed > 0}
        <div class="detail-row">
            <span class="label">Total Gas Used</span>
            <span class="value">{totalGasUsed.toString()}</span>
        </div>
    {/if}

    <div class="transactions-list">
        <h4>Transaction Details</h4>
        {#each transactions as tx}
            {@const state = states.get(tx.id)}
            {@const txHash = state?.txHash}
            <div class="transaction-item" class:has-hash={txHash}>
                <div class="tx-status" class:success={state?.status === 'success'} class:error={state?.status === 'failed'} class:warning={state?.status === 'skipped'}>
                    <span class="status-icon">{getStatusIcon(state?.status || 'pending')}</span>
                    <span class="status-text">{state?.status || 'pending'}</span>
                </div>
                <div class="tx-details">
                    <div class="tx-title">{tx.metadata?.title || 'Transaction'}</div>
                    <div class="tx-description">{tx.metadata?.description || ''}</div>
                    {#if txHash}
                        <a 
                            href={`${explorerBaseUrl}${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="tx-hash"
                        >
                            {formatTxHash(txHash)} ↗
                        </a>
                    {/if}
                    {#if state?.error}
                        <div class="tx-error">{state.error}</div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

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

    .transactions-list {
        margin-top: 1.5rem;
    }

    h4 {
        margin: 0 0 1rem;
        font-size: 1rem;
        font-weight: 500;
        color: #333;
    }

    .transaction-item {
        display: flex;
        align-items: flex-start;
        padding: 1rem;
        background: white;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        transition: all 0.2s ease;
    }

    .transaction-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tx-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 100px;
        padding-right: 1rem;
    }

    .status-icon {
        font-size: 1.25rem;
    }

    .status-text {
        font-size: 0.875rem;
        text-transform: capitalize;
    }

    .tx-details {
        flex: 1;
    }

    .tx-title {
        font-weight: 500;
        margin-bottom: 0.25rem;
    }

    .tx-description {
        font-size: 0.875rem;
        color: #666;
        margin-bottom: 0.5rem;
    }

    .tx-hash {
        display: inline-block;
        font-family: monospace;
        font-size: 0.875rem;
        color: #2196F3;
        text-decoration: none;
        background: #E3F2FD;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .tx-hash:hover {
        background: #BBDEFB;
        text-decoration: underline;
    }

    .tx-error {
        margin-top: 0.5rem;
        color: #f44336;
        font-size: 0.875rem;
    }

    .tx-status.success {
        color: #4CAF50;
    }

    .tx-status.error {
        color: #f44336;
    }

    .tx-status.warning {
        color: #ff9800;
    }

    /* Dark theme support */
    :global(.dark) h4 {
        color: #fff;
    }

    :global(.dark) .transaction-item {
        background: #333;
    }

    :global(.dark) .tx-description {
        color: #999;
    }

    :global(.dark) .tx-hash {
        background: #1a237e;
        color: #64B5F6;
    }

    :global(.dark) .tx-hash:hover {
        background: #283593;
    }

    :global(.dark) .transaction-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
</style> 