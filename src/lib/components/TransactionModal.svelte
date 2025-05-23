<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Transaction, TransactionType, TransactionStatus, TransactionState } from '../types';
    import ethers from 'ethers';
    import type { ThemeConfig } from '$lib/types/theme';
    import { defaultTheme } from '$lib/types/theme';
    import ProgressTracker from './ProgressTracker.svelte';
    import TransactionCard from './TransactionCard.svelte';
    import SummarySection from './SummarySection.svelte';

    export let isOpen = false;
    export let transactions: Transaction[] = [];
    export let signer: ethers.Signer;
    export let theme: 'light' | 'dark' = 'light';
    export let showSummary = true;
    export let title = 'Borrow 1000 USDC';
    export let subtitle = 'Variable Rolling Rate';
    export let redirectUrl = '#';
    export let socialLinks: Array<{label: string, url: string}> = [];
    export let blockExplorerUrl: string;
    export let supportChannelUrl = 'https://t.me/your-support';
    export let customTheme: Partial<ThemeConfig> = {};
    export let closeOnOverlayClick: boolean = false;
    export let successMessage = 'Head to the Positions page to track and manage your new position.';
    export let redirectMessage = 'Positions';
    export let showHelpSection = true;
    export let helpMessage = 'Need help or have feedback?';
    export let helpRedirectText = 'Chat with someone';
    export let showFinalSuccessScreen: boolean = true;

    const dispatch = createEventDispatcher();

    let states: Map<string, TransactionState> = new Map();
    let currentIndex = 0;
    let processingStartTime = new Map<string, number>();
    let processingDuration = new Map<string, number>();
    let durationInterval: number;

    // Merge custom theme with default theme
    $: themeConfig = {
        light: { ...defaultTheme.light, ...customTheme.light },
        dark: { ...defaultTheme.dark, ...customTheme.dark }
    };

    onMount(() => {
        states = new Map(transactions.map(tx => [tx.id, { status: 'pending' }]));
        currentIndex = 0;
        return () => {
            if (durationInterval) clearInterval(durationInterval);
        };
    });

    function updateDurations() {
        const now = Date.now();
        processingDuration = new Map(
            Array.from(processingStartTime.entries()).map(([txId, startTime]) => [
                txId,
                Math.floor((now - startTime) / 1000)
            ])
        );
    }

    function handleClose() {
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
        dispatch('cancel');
    }

    function handleChat() {
        if (supportChannelUrl) {
            window.open(supportChannelUrl, '_blank');
        }
    }

    function handleRedirect(e: Event) {
        e.preventDefault();
        handleClose();
        window.location.href = redirectUrl;
    }

    $: currentTransaction = transactions[currentIndex];
    $: isComplete = currentIndex >= transactions.length;
    $: hasError = transactions.some(tx => states.get(tx.id)?.status === 'failed');
    $: hasPending = transactions.some(tx => states.get(tx.id)?.status === 'pending');

    // Start/stop intervals based on modal visibility
    $: if (isOpen) {
        durationInterval = setInterval(updateDurations, 1000);
    } else {
        if (durationInterval) clearInterval(durationInterval);
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
            return;
        }

        states.set(transaction.id, { status: 'processing' });
        states = new Map(states);
        processingStartTime.set(transaction.id, Date.now());

        try {
            const txResponse = await signer.sendTransaction({
                to: transaction.params.to,
                data: transaction.params.data,
                value: transaction.params.value || '0'
            });

            // Update state with pending transaction hash
            states.set(transaction.id, { 
                status: 'processing',
                hash: txResponse.hash 
            });
            states = new Map(states);

            const receipt = await txResponse.wait();
            
            // Update final success state
            states.set(transaction.id, { 
                status: 'success',
                hash: receipt.hash 
            });
            states = new Map(states);
            
            // Move to next transaction if available
            if (currentIndex < transactions.length - 1) {
                currentIndex++;
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            states.set(transaction.id, { 
                status: 'failed',
                error: error.message 
            });
            states = new Map(states);
        }
    }

    $: allTransactionsSuccessful = transactions.length > 0 && 
        transactions.every(tx => states.get(tx.id)?.status === 'success');

    $: messageParts = successMessage.split(redirectMessage);
</script>

{#if isOpen}
<div 
    class="modal-overlay"
    class:dark={theme === 'dark'}
    on:click={closeOnOverlayClick ? handleClose : undefined}
    on:keydown={e => e.key === 'Escape' && handleClose()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    style="
        --primary-color: {themeConfig[theme].primary};
        --success-color: {themeConfig[theme].success};
        --error-color: {themeConfig[theme].error};
        --text-color: {themeConfig[theme].text};
        --background-color: {themeConfig[theme].background};
        --border-color: {themeConfig[theme].border};
        --disabled-color: {themeConfig[theme].disabled};
        --hover-color: {themeConfig[theme].hover};
        --card-color: {themeConfig[theme].card || (theme === 'dark' ? '#374151' : '#F7F7FA')};
        --button-primary: {themeConfig[theme].buttonPrimary || themeConfig[theme].primary};
        --button-primary-text: {themeConfig[theme].buttonPrimaryText || '#fff'};
        --button-disabled: {themeConfig[theme].buttonDisabled || 'rgba(79,127,255,0.1)'};
        --button-disabled-text: {themeConfig[theme].buttonDisabledText || themeConfig[theme].primary};
        --button-error: {themeConfig[theme].buttonError || themeConfig[theme].error};
        --button-error-text: {themeConfig[theme].buttonErrorText || '#fff'};
        --button-success: {themeConfig[theme].buttonSuccess || '#fff'};
        --button-success-text: {themeConfig[theme].buttonSuccessText || '#64748B'};
        --button-processing: {themeConfig[theme].buttonProcessing || themeConfig[theme].primary};
        --button-processing-text: {themeConfig[theme].buttonProcessingText || '#fff'};
        --button-hover: {themeConfig[theme].buttonHover || themeConfig[theme].hover};
    "
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
            {#if !allTransactionsSuccessful || !showFinalSuccessScreen}
                <div class="transaction-list">
                    {#each transactions as transaction (transaction.id)}
                        <div class="transaction-row">
                            <div class="tx-info">{transaction.metadata.title}</div>
                            {#if states.get(transaction.id)?.status === 'success'}
                                <a
                                    href={`${blockExplorerUrl}${states.get(transaction.id)?.hash}`}
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
                            {:else if states.get(transaction.id)?.status === 'processing'}
                                <a
                                    href={`${blockExplorerUrl}${states.get(transaction.id)?.hash}`}
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
                {#if allTransactionsSuccessful && !showFinalSuccessScreen}
                    <div class="success-at-bottom">Successful</div>
                {/if}
            {:else}
                <div class="success-screen">
                    <p class="success-message">
                        {messageParts[0]}<a href={redirectUrl} on:click={handleRedirect}>{redirectMessage}</a>{messageParts[1]}
                    </p>
                    {#if socialLinks.length > 0}
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
        background: var(--card-color, #F7F7FA);
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
        background: var(--button-primary);
        color: var(--button-primary-text);
    }

    .action-button.active:hover {
        background: var(--button-hover);
    }

    .action-button.disabled {
        background: var(--button-disabled);
        color: var(--button-disabled-text);
        cursor: not-allowed;
        opacity: 1;
    }

    .action-button.processing {
        background: var(--button-processing);
        color: var(--button-processing-text);
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .action-button.processing:hover {
        background: var(--button-hover);
    }

    .action-button.success {
        background: var(--button-success);
        color: var(--button-success-text);
        border: 1px solid var(--border-color);
        padding-right: 12px;
    }

    .action-button.success:hover {
        background: #F8FAFC;
    }

    .action-button.error {
        background: var(--button-error);
        color: var(--button-error-text);
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
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        margin-right: 8px;
        animation: spin 1s linear infinite;
        display: inline-block;
        vertical-align: middle;
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
        text-align: center;
    }

    :global(.success-message a) {
        color: var(--primary-color) !important;
        text-decoration: none !important;
        font-weight: 400 !important;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        font-size: inherit;
    }

    :global(.success-message a:hover) {
        text-decoration: underline !important;
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
        background: var(--card-color, #374151);
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

    /* Update CSS variables to use theme colors */
    :global(.modal-backdrop) {
        --primary-color: var(--primary-color, #4F7FFF);
        --success-color: var(--success-color, #10B981);
        --error-color: var(--error-color, #DC2626);
        --text-color: var(--text-color, #111827);
        --background-color: var(--background-color, #FFFFFF);
        --border-color: var(--border-color, #E5E7EB);
        --disabled-color: var(--disabled-color, #9CA3AF);
        --hover-color: var(--hover-color, #3B82F6);
    }

    .external-link-icon {
        display: inline-flex;
        align-items: center;
        margin-left: 0.25em;
        vertical-align: middle;
        color: inherit;
    }
    .external-link-icon svg {
        width: 1em;
        height: 1em;
        stroke: currentColor;
    }

    .success-at-bottom {
        color: var(--success-color);
        font-size: 1.1rem;
        font-weight: 600;
        text-align: center;
        margin-top: 1.5rem;
    }
</style> 