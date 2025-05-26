<script>import { createEventDispatcher } from "svelte";
import * as ethers from "ethers";
import { defaultTheme } from "../types/theme";
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
export let transactionStatuses;
export let customTheme = {};
const dispatch = createEventDispatcher();
$: allTransactionsSuccessful = transactions.length > 0 && transactions.every((tx) => $transactionStatuses[tx.id]?.status === "success");
$: messageParts = successMessage.includes(redirectMessage) ? successMessage.split(redirectMessage) : ["", ""];
$: currentTheme = {
  ...defaultTheme[theme],
  ...customTheme?.[theme] || {}
};
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
  const currentStatus = $transactionStatuses[txId]?.status;
  if (txIndex === 0) {
    return currentStatus === "pending" || currentStatus === "failed";
  }
  const allPreviousSuccessful = transactions.slice(0, txIndex).every((tx) => $transactionStatuses[tx.id]?.status === "success");
  return allPreviousSuccessful && (!currentStatus || currentStatus === "pending" || currentStatus === "failed");
}
function handleTxExecute(transactionId) {
  dispatch("txExecute", { transactionId });
}
</script>

<div
  class="web3-tx-modal"
  style="
    --button-primary: {currentTheme.buttonPrimary};
    --button-primary-text: {currentTheme.buttonPrimaryText};
    --button-disabled: {currentTheme.buttonDisabled};
    --button-disabled-text: {currentTheme.buttonDisabledText};
    --button-error: {currentTheme.buttonError};
    --button-error-text: {currentTheme.buttonErrorText};
    --button-success: {currentTheme.buttonSuccess};
    --button-success-text: {currentTheme.buttonSuccessText};
    --button-processing: {currentTheme.buttonProcessing};
    --button-processing-text: {currentTheme.buttonProcessingText};
    --button-hover: {currentTheme.buttonHover};
    --primary-color: {currentTheme.primary};
    --success-color: {currentTheme.success};
    --error-color: {currentTheme.error};
    --text-color: {currentTheme.text};
    --background-color: {currentTheme.background};
    --border-color: {currentTheme.border};
    --disabled-color: {currentTheme.disabled};
    --hover-color: {currentTheme.hover};
    --card-color: {currentTheme.card};
    --font-family: {theme.fontFamily};
    --title-font-size: {theme.titleFontSize};
    --title-color: {theme.titleColor};
    --subtitle-font-size: {theme.subtitleFontSize};
    --subtitle-color: {theme.subtitleColor};
    --metadata-title-font-size: {theme.metadataTitleFontSize};
    --metadata-title-color: {theme.metadataTitleColor};
    --metadata-button-label-font-size: {theme.metadataButtonLabelFontSize};
    --metadata-button-label-color: {theme.metadataButtonLabelColor};
    --metadata-button-label-success-color: {theme.metadataButtonLabelSuccessColor};
    --help-text-font-size: {theme.helpTextFontSize};
    --help-text-color: {theme.helpTextColor};
    --help-redirect-font-size: {theme.helpRedirectFontSize};
    --help-redirect-color: {theme.helpRedirectColor};
    --help-redirect-hover-color: {theme.helpRedirectHoverColor};
    --social-link-font-size: {theme.socialLinkFontSize};
    --social-link-color: {theme.socialLinkColor};
    --social-link-button-background: {theme.socialLinkButtonBackground};
    --success-message-font-size: {theme.successMessageFontSize};
    --success-message-color: {theme.successMessageColor};
    --success-redirect-color: {theme.successRedirectColor};
    --success-redirect-hover-color: {theme.successRedirectHoverColor};
    --modal-background: {theme.modalBackground};
    --primary-action-button-background: {theme.primaryActionButtonBackground};
    --primary-success-button-background: {theme.primarySuccessButtonBackground};
    --disabled-button-background: {theme.disabledButtonBackground};
  "
>
  {#if isOpen}
    <div 
      class="web3-tx-modal-overlay"
      class:dark={theme === 'dark'}
      on:click={closeOnOverlayClick ? handleClose : undefined}
      on:keydown={e => e.key === 'Escape' && handleClose()}
      aria-label="Close modal"
    >
      <div 
        class="web3-tx-modal-content"
        role="dialog"
        aria-modal="true"
        on:click|stopPropagation
        cursor: default
      >
        <header class="web3-tx-modal-header">
          <div class="web3-tx-modal-title-section">
            {#if allTransactionsSuccessful}
              <h2 id="modal-title">Borrow Successful!</h2>
            {:else}
              <h2 id="modal-title">{title}</h2>
            {/if}
            {#if !allTransactionsSuccessful}
              <div class="web3-tx-modal-subtitle">{subtitle}</div>
            {/if}
          </div>
          <button 
            class="web3-tx-modal-close-button"
            on:click={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>

        <div class="web3-tx-modal-body">
          {#if !allTransactionsSuccessful || !showFinalSuccessScreen}
            <div class="web3-tx-modal-transaction-list">
              {#key $transactionStatuses}
                {#each transactions || [] as transaction (transaction.id)}
                  <div class="web3-tx-modal-transaction-row">
                    <div class="web3-tx-modal-tx-info">{transaction.metadata?.title}</div>
                    {#if $transactionStatuses[transaction.id]?.status === 'success'}
                      <a
                        href={`${blockExplorerUrl}${$transactionStatuses[transaction.id]?.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="web3-tx-modal-action-button web3-tx-modal-action-button-success"
                      >
                        Success
                        <span class="web3-tx-modal-external-link-icon">
                          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </span>
                      </a>
                    {:else if $transactionStatuses[transaction.id]?.status === 'processing'}
                      <a
                        href={`${blockExplorerUrl}${$transactionStatuses[transaction.id]?.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="web3-tx-modal-action-button web3-tx-modal-action-button-processing"
                      >
                        <span class="web3-tx-modal-spinner"></span>
                        Pending...
                        <span class="web3-tx-modal-external-link-icon">
                          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </span>
                      </a>
                    {:else if $transactionStatuses[transaction.id]?.status === 'failed'}
                      <button class="web3-tx-modal-action-button web3-tx-modal-action-button-error" on:click={() => handleTxExecute(transaction.id)}>
                        Retry
                      </button>
                    {:else if (
                      transactions
                        .slice(0, transactions.findIndex(tx => tx.id === transaction.id))
                        .every(tx => $transactionStatuses[tx.id]?.status === 'success') &&
                      (
                        !$transactionStatuses[transaction.id]?.status ||
                        $transactionStatuses[transaction.id]?.status === 'pending' ||
                        $transactionStatuses[transaction.id]?.status === 'failed'
                      )
                    )}
                      <button class="web3-tx-modal-action-button web3-tx-modal-action-button-active" on:click={() => handleTxExecute(transaction.id)}>
                        {transaction.metadata?.buttonLabel}
                      </button>
                    {:else}
                      <button class="web3-tx-modal-action-button web3-tx-modal-action-button-disabled">{transaction.metadata?.buttonLabel}</button>
                    {/if}
                  </div>
                {/each}
              {/key}
            </div>
            {#if allTransactionsSuccessful && !showFinalSuccessScreen}
              <div class="web3-tx-modal-success-at-bottom">Successful</div>
            {/if}
          {:else}
            <div class="web3-tx-modal-success-screen">
              <p class="web3-tx-modal-success-message">
                {messageParts[0]}<a href={redirectUrl} on:click={handleRedirect}>{redirectMessage}</a>{messageParts[1]}
              </p>
              {#if socialLinks?.length > 0}
                <div class="web3-tx-modal-social-links">
                  {#each socialLinks as {label, url}}
                    <button class="web3-tx-modal-social-button" on:click={() => window.open(url, '_blank')}>
                      {label}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <footer class="web3-tx-modal-footer">
          {#if showHelpSection}
            <div class="web3-tx-modal-help-text">
              {helpMessage} <button class="web3-tx-modal-chat-link" on:click={handleChat}>{helpRedirectText}</button>.
            </div>
          {/if}
        </footer>
      </div>
    </div>
  {/if}
</div>


<style>
.web3-tx-modal {
  font-family: var(--font-family, inherit);
  background: var(--modal-background, rgba(62, 124, 255, 0.3));
  /* Scoping container */
}

.web3-tx-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 41, 59, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: default;
}

.web3-tx-modal-content {
  width: 480px;
  padding: 32px;
  border-radius: 16px;
  background: var(--modal-background, #FAFAFB);
  box-shadow: 0 8px 32px rgba(16, 30, 54, 0.12);
  position: relative;
  cursor: default;
}

.web3-tx-modal-header {
  margin-bottom: 24px;
  text-align: left;
  position: relative;
}

.web3-tx-modal-title-section {
  text-align: center;
  flex: 1;
}

.web3-tx-modal h2 {
  font-size: var(--title-font-size, 24px);
  font-weight: 600;
  color: var(--title-color, #111827);
}

.web3-tx-modal-subtitle {
  font-size: var(--subtitle-font-size, 16px);
  color: var(--subtitle-color, #6B7280);
  margin-top: 4px;
}

.web3-tx-modal-close-button {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 24px;
  color: #9CA3AF;
  cursor: pointer;
}

.web3-tx-modal-body {
  padding: 1rem;
}

.web3-tx-modal-transaction-list {
  margin-bottom: 0;
}

.web3-tx-modal-transaction-row {
  background: var(--card-color, #EEEFFA);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.web3-tx-modal-tx-info {
  font-size: 16px;
  color: var(--metadata-title-color, #111827);
  font-weight: 500;
}

.web3-tx-modal .web3-tx-modal-action-button,
.web3-tx-modal .web3-tx-modal-action-button-success,
.web3-tx-modal .web3-tx-modal-action-button-processing,
.web3-tx-modal .web3-tx-modal-action-button-error,
.web3-tx-modal .web3-tx-modal-action-button-active,
.web3-tx-modal .web3-tx-modal-action-button-disabled {
  font-size: var(--metadata-button-label-font-size, 14px);
  font-weight: 500;
  border-radius: 8px;
  border: none;
  outline: none;
  min-width: 90px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
  padding: 8px 16px;
  cursor: default;
}

.web3-tx-modal .web3-tx-modal-action-button-active {
  background: var(--primary-action-button-background, #2B51E8);
  color: var(--button-primary-text);
  cursor: pointer;
}

.web3-tx-modal .web3-tx-modal-action-button-active:hover {
  background: var(--button-hover);
}

.web3-tx-modal .web3-tx-modal-action-button-disabled {
  background: var(--disabled-button-background, #BDC9F8);
  color: var(--button-disabled-text, #FFFFFF);
  cursor: not-allowed;
}

.web3-tx-modal .web3-tx-modal-action-button-processing {
  background: var(--primary-action-button-background, #2B51E8);
  color: var(--button-processing-text, #FFFFFF);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.web3-tx-modal .web3-tx-modal-action-button-processing:hover {
  background: var(--button-hover);
}

.web3-tx-modal .web3-tx-modal-action-button-success {
  background: var(--primary-success-button-background, #FFFFFF);
  color: var(--metadata-button-label-success-color, #000000);
  border: 1px solid var(--border-color);
  padding-right: 12px;
  cursor: pointer;
}

.web3-tx-modal .web3-tx-modal-action-button-success:hover {
  background: #F8FAFC;
}

.web3-tx-modal .web3-tx-modal-action-button-error {
  background: var(--button-error);
  color: var(--button-error-text);
  cursor: pointer;
}

.web3-tx-modal .web3-tx-modal-action-button-error:hover {
  background: #B91C1C;
}

.web3-tx-modal-spinner {
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

.web3-tx-modal-success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
  margin-top: -1rem;
}

.web3-tx-modal-success-message {
  font-size: var(--success-message-font-size, 16px);
  line-height: 24px;
  color: var(--success-message-color, #64748B);
  margin: 24px 0 32px;
  font-weight: 400;
  text-align: center;
}

.web3-tx-modal :global(.web3-tx-modal-success-message a) {
  color: var(--primary-color) !important;
  text-decoration: none !important;
  font-weight: 400 !important;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
}

.web3-tx-modal :global(.web3-tx-modal-success-message a:hover) {
  text-decoration: underline !important;
}

.web3-tx-modal-social-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 0 32px;
  max-width: 280px;
  margin: 0 auto;
}

.web3-tx-modal-social-button {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 100px;
  background: var(--social-link-button-background, #FFFFFF);
  color: var(--social-link-color, #334155);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  min-width: 200px;
  white-space: nowrap;
}

.web3-tx-modal-social-button:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.web3-tx-modal-footer {
  margin-top: 32px;
  text-align: center;
}

.web3-tx-modal-help-text {
  font-size: var(--help-text-font-size, 14px);
  color: var(--help-text-color, #64748B);
  font-weight: 400;
}

.web3-tx-modal-chat-link {
  background: none;
  border: none;
  color: var(--help-text-color, #555F81);
  padding: 0;
  font-size: inherit;
  font-weight: 400;
  cursor: pointer;
}

.web3-tx-modal-chat-link:hover {
  color: var(--help-text-color, #555F81);
  text-decoration: underline;
  text-decoration-color: var(--help-text-color, #555F81);
}

.web3-tx-modal-external-link-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 0.25em;
  vertical-align: middle;
  color: inherit;
}

.web3-tx-modal-external-link-icon svg {
  width: 1em;
  height: 1em;
  stroke: currentColor;
}

.web3-tx-modal-success-at-bottom {
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
.web3-tx-modal.dark .web3-tx-modal-content {
  background: var(--modal-background, #181A20);
}

.web3-tx-modal.dark h2 {
  color: white;
}

.web3-tx-modal.dark .web3-tx-modal-subtitle,
.web3-tx-modal.dark .web3-tx-modal-help-text {
  color: #9CA3AF;
}

.web3-tx-modal.dark .web3-tx-modal-transaction-row {
  background: var(--card-color);
}

.web3-tx-modal.dark .web3-tx-modal-tx-info {
  color: white;
}

.web3-tx-modal.dark .web3-tx-modal-action-button-disabled {
  background: var(--disabled-button-background, #3A4668);
  color: var(--button-disabled-text, #FFFFFF);
}

.web3-tx-modal.dark .web3-tx-modal-action-button-processing {
  background: #4F7FFF;
  color: white;
}

.web3-tx-modal.dark .web3-tx-modal-action-button-success {
  background: #1F2937;
  border-color: #374151;
  color: #9CA3AF;
}

.web3-tx-modal.dark .web3-tx-modal-action-button-success:hover {
  background: #374151;
}

.web3-tx-modal.dark .web3-tx-modal-close-button {
  color: #9CA3AF;
}
</style>