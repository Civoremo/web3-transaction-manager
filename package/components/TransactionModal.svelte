<script>import { createEventDispatcher } from "svelte";
import * as ethers from "ethers";
export let isOpen = false;
export let transactions = [];
export let signer;
export let address;
export let theme = "light";
export let title = "Borrow 1000 USDC";
export let subtitle = "Variable Rolling Rate";
export let redirectUrl = "#";
export let socialLinks = [];
export let blockExplorerUrl;
export let supportChannelUrl = "https://t.me/your-support";
export let closeOnOverlayClick = false;
export let successMessage = "Head to the Positions page to track and manage your new position.";
export let redirectMessage = "Positions";
export let showHelpSection = true;
export let helpMessage = "Need help or have feedback?";
export let helpRedirectText = "Chat with someone";
export let showFinalSuccessScreen = true;
const dispatch = createEventDispatcher();
let internalStatuses = {};
$: {
  for (const tx of transactions) {
    if (!internalStatuses[tx.id]) {
      internalStatuses[tx.id] = { status: "pending" };
    }
  }
}
$: allTransactionsSuccessful = transactions.length > 0 && Object.values(internalStatuses).every((s) => s.status === "success");
$: messageParts = successMessage.includes(redirectMessage) ? successMessage.split(redirectMessage) : ["", ""];
function handleClose() {
  dispatch("close");
}
function handleChat() {
  if (supportChannelUrl) {
    window.open(supportChannelUrl, "_blank");
  }
}
function handleRedirect(e) {
  e.preventDefault();
  handleClose();
  window.location.href = redirectUrl;
}
function canExecute(txId) {
  const txIndex = transactions.findIndex((tx) => tx.id === txId);
  if (txIndex < 0) return false;
  const currentStatus = internalStatuses[txId]?.status;
  if (txIndex === 0) return currentStatus === "pending" || currentStatus === "failed";
  const allPreviousSuccessful = transactions.slice(0, txIndex).every((tx) => internalStatuses[tx.id]?.status === "success");
  return (currentStatus === "pending" || currentStatus === "failed") && allPreviousSuccessful;
}
async function executeTransaction(transactionId) {
  const tx = transactions.find((tx2) => tx2.id === transactionId);
  if (!tx || !signer) return;
  internalStatuses[transactionId].status = "processing";
  try {
    const txResponse = await signer.sendTransaction(tx.params);
    internalStatuses[transactionId] = {
      status: "processing",
      hash: txResponse.hash
    };
    const receipt = await txResponse.wait();
    internalStatuses[transactionId].status = receipt.status === 1 ? "success" : "failed";
  } catch (err) {
    console.error(`Transaction ${transactionId} failed`, err);
    internalStatuses[transactionId].status = "failed";
  }
}
</script>


<div class="web3-tx-modal">
  {#if isOpen}
    <div 
      class="modal-overlay"
      class:dark={theme === 'dark'}
      on:click={closeOnOverlayClick ? handleClose : undefined}
      on:keydown={e => e.key === 'Escape' && handleClose()}
      role="button"
      aria-label="Close modal"
    >
      <div 
        class="modal-content"
        role="dialog"
        aria-modal="true"
        on:click|stopPropagation
      >
        <header class="modal-header">
          <div class="title-section">
            {#if allTransactionsSuccessful}
              <h2 id="modal-title">Borrow Successful!</h2>
            {:else}
              <h2 id="modal-title">{title}</h2>
            {/if}
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
          {#if !allTransactionsSuccessful || !showFinalSuccessScreen}
            <div class="transaction-list">
              {#each transactions || [] as transaction}
                <div class="transaction-row">
                  <div class="tx-info">{transaction.metadata?.title}</div>
                  {#if internalStatuses[transaction.id]?.status === 'success'}
                    <a
                      href={`${blockExplorerUrl}${internalStatuses[transaction.id]?.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="action-button success"
                    >
                      Success
                      <span class="external-link-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                          <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </span>
                    </a>
                  {:else if internalStatuses[transaction.id]?.status === 'processing'}
                    <a
                      href={`${blockExplorerUrl}${internalStatuses[transaction.id]?.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="action-button processing"
                    >
                      <span class="spinner"></span>
                      Pending...
                      <span class="external-link-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                          <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </span>
                    </a>
                  {:else if internalStatuses[transaction.id]?.status === 'failed'}
                    <button class="action-button error" on:click={() => executeTransaction(transaction.id)}>
                      Retry
                    </button>
                  {:else if canExecute(transaction.id)}
                    <button class="action-button active" on:click={() => executeTransaction(transaction.id)}>
                      {transaction.metadata?.buttonLabel}
                    </button>
                  {:else}
                    <button class="action-button disabled">{transaction.metadata?.buttonLabel}</button>
                  {/if}
                </div>
              {/each}
            </div>
            {#if allTransactionsSuccessful && !showFinalSuccessScreen}
              <div class="success-at-bottom">Successful</div>
            {/if}
          {:else}
            <div class="success-screen">
              <p class="success-message">
                {messageParts[0]}<a href={redirectUrl} on:click={handleRedirect}>{redirectMessage}</a>{messageParts[1]}
              </p>
              {#if socialLinks?.length > 0}
                <div class="social-links">
                  {#each socialLinks as {label, url}}
                    <button class="social-button" on:click={() => window.open(url, '_blank')}>
                      {label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <footer class="modal-footer">
          {#if showHelpSection}
            <div class="help-text">
              {helpMessage} <button class="chat-link" on:click={handleChat}>{helpRedirectText}</button>.
            </div>
          {/if}
        </footer>
      </div>
    </div>
  {/if}
</div>


<style>
.web3-tx-modal {
  /* Scoping container */
}

.web3-tx-modal .modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 41, 59, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.web3-tx-modal .modal-content {
  width: 480px;
  padding: 32px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 8px 32px rgba(16, 30, 54, 0.12);
  position: relative;
}

.web3-tx-modal .modal-header {
  margin-bottom: 24px;
  text-align: left;
  position: relative;
}

.web3-tx-modal .title-section {
  text-align: center;
  flex: 1;
}

.web3-tx-modal h2 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.web3-tx-modal .subtitle {
  font-size: 16px;
  color: #6B7280;
  margin-top: 4px;
}

.web3-tx-modal .close-button {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 24px;
  color: #9CA3AF;
  cursor: pointer;
}

.web3-tx-modal .modal-body {
  padding: 1rem;
}

.web3-tx-modal .transaction-list {
  margin-bottom: 0;
}

.web3-tx-modal .transaction-row {
  background: var(--card-color, #F7F7FA);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.web3-tx-modal .tx-info {
  font-size: 16px;
  color: #111827;
  font-weight: 500;
}

.web3-tx-modal .action-button {
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

.web3-tx-modal .action-button.active {
  background: var(--button-primary);
  color: var(--button-primary-text);
}

.web3-tx-modal .action-button.active:hover {
  background: var(--button-hover);
}

.web3-tx-modal .action-button.disabled {
  background: var(--button-disabled);
  color: var(--button-disabled-text);
  cursor: not-allowed;
  opacity: 1;
}

.web3-tx-modal .action-button.processing {
  background: var(--button-processing);
  color: var(--button-processing-text);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.web3-tx-modal .action-button.processing:hover {
  background: var(--button-hover);
}

.web3-tx-modal .action-button.success {
  background: var(--button-success);
  color: var(--button-success-text);
  border: 1px solid var(--border-color);
  padding-right: 12px;
}

.web3-tx-modal .action-button.success:hover {
  background: #F8FAFC;
}

.web3-tx-modal .action-button.error {
  background: var(--button-error);
  color: var(--button-error-text);
  cursor: pointer;
}

.web3-tx-modal .action-button.error:hover {
  background: #B91C1C;
}

.web3-tx-modal .spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

.web3-tx-modal .success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
  margin-top: -1rem;
}

.web3-tx-modal .success-message {
  font-size: 16px;
  line-height: 24px;
  color: #64748B;
  margin: 24px 0 32px;
  font-weight: 400;
  text-align: center;
}

.web3-tx-modal :global(.success-message a) {
  color: var(--primary-color) !important;
  text-decoration: none !important;
  font-weight: 400 !important;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
}

.web3-tx-modal :global(.success-message a:hover) {
  text-decoration: underline !important;
}

.web3-tx-modal .social-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 0 32px;
  max-width: 280px;
  margin: 0 auto;
}

.web3-tx-modal .social-button {
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

.web3-tx-modal .social-button:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.web3-tx-modal .modal-footer {
  margin-top: 32px;
  text-align: center;
}

.web3-tx-modal .help-text {
  font-size: 14px;
  color: #64748B;
  font-weight: 400;
}

.web3-tx-modal .chat-link {
  background: none;
  border: none;
  color: #4F7FFF;
  padding: 0;
  font-size: inherit;
  font-weight: 400;
  cursor: pointer;
}

.web3-tx-modal .chat-link:hover {
  text-decoration: underline;
}

.web3-tx-modal .external-link-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 0.25em;
  vertical-align: middle;
  color: inherit;
}

.web3-tx-modal .external-link-icon svg {
  width: 1em;
  height: 1em;
  stroke: currentColor;
}

.web3-tx-modal .success-at-bottom {
  color: var(--success-color);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  margin-top: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Dark theme overrides */
.web3-tx-modal.dark .modal-content {
  background: #1F2937;
}

.web3-tx-modal.dark h2 {
  color: white;
}

.web3-tx-modal.dark .subtitle,
.web3-tx-modal.dark .help-text {
  color: #9CA3AF;
}

.web3-tx-modal.dark .transaction-row {
  background: var(--card-color, #374151);
}

.web3-tx-modal.dark .tx-info {
  color: white;
}

.web3-tx-modal.dark .action-button.disabled {
  background: rgba(79, 127, 255, 0.1);
  color: #4F7FFF;
}

.web3-tx-modal.dark .action-button.processing {
  background: #4F7FFF;
  color: white;
}

.web3-tx-modal.dark .action-button.success {
  background: #1F2937;
  border-color: #374151;
  color: #9CA3AF;
}

.web3-tx-modal.dark .action-button.success:hover {
  background: #374151;
}

.web3-tx-modal.dark .close-button {
  color: #9CA3AF;
}
</style>