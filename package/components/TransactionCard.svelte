<script>export let transaction;
export let state;
export let onExecute;
export let onRetry;
export let theme = "light";
$: status = state?.status || "pending";
$: error = state?.error;
$: hash = state?.hash;
function getStatusMessage(status2) {
  switch (status2) {
    case "pending":
      return "Waiting for approval...";
    case "processing":
      return "Transaction in progress...";
    case "success":
      return "Transaction successful";
    case "failed":
      return error || "Transaction failed";
    default:
      return "Unknown status";
  }
}
function getButtonLabel(status2) {
  switch (status2) {
    case "pending":
      return transaction.metadata?.actionLabel || "Approve";
    case "processing":
      return "Processing...";
    case "success":
      return "Completed";
    case "failed":
      return "Retry";
    default:
      return "Unknown";
  }
}
function getButtonClass(status2) {
  switch (status2) {
    case "pending":
      return "primary";
    case "processing":
      return "processing";
    case "success":
      return "success";
    case "failed":
      return "error";
    default:
      return "";
  }
}
</script>

<div class="transaction-card" class:dark={theme === 'dark'}>
    <div class="card-content">
        <div class="transaction-info">
            <h3>{transaction.metadata?.title || 'Transaction'}</h3>
            <p class="status-message" class:error={status === 'failed'}>
                {getStatusMessage(status)}
            </p>
            {#if hash}
                <a 
                    href={`https://etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hash-link"
                >
                    View on Etherscan
                </a>
            {/if}
        </div>

        <button
            class="action-button {getButtonClass(status)}"
            on:click={() => status === 'failed' ? onRetry() : onExecute()}
            disabled={status === 'processing' || status === 'success'}
        >
            {#if status === 'processing'}
                <span class="spinner"></span>
            {/if}
            {getButtonLabel(status)}
            {#if status === 'success'}
                <span class="success-icon">✓</span>
            {/if}
        </button>
    </div>
</div>

<style>
    .transaction-card {
        background: #f8f9fe;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .card-content {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .transaction-info {
        flex: 1;
    }

    h3 {
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 500;
        color: #1a1a1a;
    }

    .status-message {
        margin: 0.25rem 0;
        font-size: 0.875rem;
        color: #666;
    }

    .status-message.error {
        color: #dc2626;
    }

    .hash-link {
        font-size: 0.875rem;
        color: #2461ff;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }

    .hash-link:hover {
        text-decoration: underline;
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

    .action-button.primary {
        background: #2461ff;
        color: white;
    }

    .action-button.primary:hover {
        background: #1d4ed8;
    }

    .action-button.processing {
        background: #e8eaf2;
        color: #666;
        cursor: not-allowed;
    }

    .action-button.success {
        background: #f8f9fe;
        color: #666;
        cursor: default;
    }

    .action-button.error {
        background: #dc2626;
        color: white;
    }

    .action-button.error:hover {
        background: #b91c1c;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .success-icon {
        font-size: 1rem;
    }

    /* Dark theme */
    .dark {
        background: #2a2a2a;
    }

    .dark h3 {
        color: #fff;
    }

    .dark .status-message {
        color: #999;
    }

    .dark .status-message.error {
        color: #ef4444;
    }

    .dark .hash-link {
        color: #60a5fa;
    }

    .dark .action-button.processing {
        background: #333;
        color: #999;
    }

    .dark .action-button.success {
        background: #2a2a2a;
        color: #999;
    }
</style> 