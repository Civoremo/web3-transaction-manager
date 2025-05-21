<script lang="ts">
    import { TransactionModal } from '$lib';
    import { TEST_TRANSACTION_FLOW } from '$lib/test/testTransactionFlow';
    import { MockSigner } from '$lib/test/mockSigner';
    import type { ThemeConfig } from '$lib/types/theme';
    import { defaultTheme } from '$lib/types/theme';
    import { writable } from 'svelte/store';

    let isOpen = false;
    let signer = new MockSigner();
    let transactions = TEST_TRANSACTION_FLOW;
    let currentTheme: 'light' | 'dark' = 'light';
    let closeOnOverlayClick = false;
    let modalKey = 0;
    let showFinalSuccessScreen = true;
    
    const socialLinks = [
        { label: 'Follow on X', url: 'https://x.com/your-handle' },
        { label: 'Join Telegram', url: 'https://t.me/your-channel' },
        { label: 'Follow on Warpcast', url: 'https://warpcast.com/your-handle' },
        { label: 'Join Discord', url: 'https://discord.gg/your-server' }
    ];

    const successMessage = 'Head to the Positions page to track and manage your new position.';
    const redirectMessage = 'Positions';
    const redirectUrl = '/';
    
    // Create a store for the theme
    const themeStore = writable<ThemeConfig>({
        light: { ...defaultTheme.light },
        dark: { ...defaultTheme.dark }
    });

    // Subscribe to theme changes
    $: {
        themeStore.set({
            light: { ...customTheme.light },
            dark: { ...customTheme.dark }
        });
    }

    let customTheme: ThemeConfig = {
        light: {
            ...defaultTheme.light,
            card: '#F7F7FA',
            buttonPrimary: '#4F7FFF',
            buttonPrimaryText: '#FFFFFF',
            buttonDisabled: 'rgba(79,127,255,0.1)',
            buttonDisabledText: '#4F7FFF',
            buttonError: '#DC2626',
            buttonErrorText: '#FFFFFF',
            buttonSuccess: '#FFFFFF',
            buttonSuccessText: '#64748B',
            buttonProcessing: '#4F7FFF',
            buttonProcessingText: '#FFFFFF',
            buttonHover: '#3B66E5',
        },
        dark: {
            ...defaultTheme.dark,
            card: '#374151',
            buttonPrimary: '#4F7FFF',
            buttonPrimaryText: '#FFFFFF',
            buttonDisabled: 'rgba(79,127,255,0.1)',
            buttonDisabledText: '#4F7FFF',
            buttonError: '#DC2626',
            buttonErrorText: '#FFFFFF',
            buttonSuccess: '#1F2937',
            buttonSuccessText: '#9CA3AF',
            buttonProcessing: '#4F7FFF',
            buttonProcessingText: '#FFFFFF',
            buttonHover: '#3B66E5',
        }
    };

    // Define grouped color fields
    const mainComponentFields = [
        { key: 'primary', label: 'Primary' },
        { key: 'success', label: 'Success' },
        { key: 'error', label: 'Error' },
        { key: 'text', label: 'Text' },
        { key: 'background', label: 'Background' },
        { key: 'border', label: 'Border' },
        { key: 'disabled', label: 'Disabled' },
        { key: 'hover', label: 'Hover' },
        { key: 'card', label: 'Card' },
    ];
    const buttonFields = [
        { key: 'buttonPrimary', label: 'Button Primary' },
        { key: 'buttonPrimaryText', label: 'Button Primary Text' },
        { key: 'buttonDisabled', label: 'Button Disabled' },
        { key: 'buttonDisabledText', label: 'Button Disabled Text' },
        { key: 'buttonError', label: 'Button Error' },
        { key: 'buttonErrorText', label: 'Button Error Text' },
        { key: 'buttonSuccess', label: 'Button Success' },
        { key: 'buttonSuccessText', label: 'Button Success Text' },
        { key: 'buttonProcessing', label: 'Button Processing' },
        { key: 'buttonProcessingText', label: 'Button Processing Text' },
        { key: 'buttonHover', label: 'Button Hover' },
    ];

    function handleSuccess() {
        console.log('Transaction successful!');
    }

    function handleError(error: any) {
        console.error('Transaction failed:', error);
    }

    function resetTheme() {
        customTheme = {
            light: {
                ...defaultTheme.light,
                card: '#F7F7FA',
                buttonPrimary: '#4F7FFF',
                buttonPrimaryText: '#FFFFFF',
                buttonDisabled: 'rgba(79,127,255,0.1)',
                buttonDisabledText: '#4F7FFF',
                buttonError: '#DC2626',
                buttonErrorText: '#FFFFFF',
                buttonSuccess: '#FFFFFF',
                buttonSuccessText: '#64748B',
                buttonProcessing: '#4F7FFF',
                buttonProcessingText: '#FFFFFF',
                buttonHover: '#3B66E5',
            },
            dark: {
                ...defaultTheme.dark,
                card: '#374151',
                buttonPrimary: '#4F7FFF',
                buttonPrimaryText: '#FFFFFF',
                buttonDisabled: 'rgba(79,127,255,0.1)',
                buttonDisabledText: '#4F7FFF',
                buttonError: '#DC2626',
                buttonErrorText: '#FFFFFF',
                buttonSuccess: '#1F2937',
                buttonSuccessText: '#9CA3AF',
                buttonProcessing: '#4F7FFF',
                buttonProcessingText: '#FFFFFF',
                buttonHover: '#3B66E5',
            }
        };
    }

    function resetTestFlow() {
        transactions = JSON.parse(JSON.stringify(TEST_TRANSACTION_FLOW));
        signer = new MockSigner();
        modalKey += 1;
    }

    // Helper to check if a color is hex
    function isHexColor(val: string) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);
    }
</script>

<div class="container">
    <h1>Web3 Transaction Manager - Component Test Page</h1>

     <section class="component-section">
        <h2>TransactionModal Component</h2>
        <div class="component-demo">
            <div class="modal-controls">
                <label class="toggle-label">
                    <input type="checkbox" bind:checked={closeOnOverlayClick} />
                    Allow closing modal by clicking outside
                </label>
                <label class="toggle-label">
                    <input type="checkbox" bind:checked={showFinalSuccessScreen} />
                    Show final success screen
                </label>
                <button on:click={() => isOpen = true}>Open Transaction Flow</button>
            </div>
            {#key modalKey}
            <TransactionModal
                {isOpen}
                {transactions}
                {signer}
                theme={currentTheme}
                customTheme={$themeStore}
                closeOnOverlayClick={closeOnOverlayClick}
                {socialLinks}
                {successMessage}
                {redirectMessage}
                {redirectUrl}
                showFinalSuccessScreen={showFinalSuccessScreen}
                on:close={() => { isOpen = false; resetTestFlow(); }}
                on:success={handleSuccess}
                on:error={handleError}
            />
            {/key}
        </div>
    </section>
    
    <div class="layout">
        <section class="component-section theme-section">
            <h2>Theme Customization</h2>
            <div class="component-demo">
                <div class="theme-controls">
                    <div class="theme-selector">
                        <button 
                            class:active={currentTheme === 'light'} 
                            on:click={() => currentTheme = 'light'}
                        >
                            Light Theme
                        </button>
                        <button 
                            class:active={currentTheme === 'dark'} 
                            on:click={() => currentTheme = 'dark'}
                        >
                            Dark Theme
                        </button>
                    </div>

                    <div class="color-pickers">
                        <h3>{currentTheme === 'light' ? 'Light Theme Colors' : 'Dark Theme Colors'}</h3>
                        <div class="color-group">
                            <h4>Main Component Colors</h4>
                            <div class="color-grid">
                                {#each mainComponentFields as {key, label}}
                                    <div class="color-picker">
                                        <label for={key}>{label}</label>
                                        <div class="color-input-wrapper">
                                            {#if isHexColor(customTheme[currentTheme][key])}
                                                <input 
                                                    type="color" 
                                                    id={key}
                                                    bind:value={customTheme[currentTheme][key]}
                                                />
                                            {:else}
                                                <div class="rgba-swatch" style="background: {customTheme[currentTheme][key]};"></div>
                                            {/if}
                                            <input 
                                                type="text" 
                                                bind:value={customTheme[currentTheme][key]}
                                                placeholder={customTheme[currentTheme][key]}
                                            />
                                        </div>
                                        {#if !isHexColor(customTheme[currentTheme][key])}
                                            <div class="rgba-note">RGBA/Non-hex color (not shown in picker)</div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                        <div class="color-group">
                            <h4>Button Colors</h4>
                            <div class="color-grid">
                                {#each buttonFields as {key, label}}
                                    <div class="color-picker">
                                        <label for={key}>{label}</label>
                                        <div class="color-input-wrapper">
                                            {#if isHexColor(customTheme[currentTheme][key])}
                                                <input 
                                                    type="color" 
                                                    id={key}
                                                    bind:value={customTheme[currentTheme][key]}
                                                />
                                            {:else}
                                                <div class="rgba-swatch" style="background: {customTheme[currentTheme][key]};"></div>
                                            {/if}
                                            <input 
                                                type="text" 
                                                bind:value={customTheme[currentTheme][key]}
                                                placeholder={customTheme[currentTheme][key]}
                                            />
                                        </div>
                                        {#if !isHexColor(customTheme[currentTheme][key])}
                                            <div class="rgba-note">RGBA/Non-hex color (not shown in picker)</div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <button class="reset-button" on:click={resetTheme}>
                        Reset to Default Theme
                    </button>
                </div>
            </div>
        </section>

        <section class="component-section preview-section">
            <h2>Theme Preview</h2>
            <div class="component-demo">
                <div class="preview-container" class:dark={currentTheme === 'dark'}>
                    <div class="preview-modal" style="
                        --primary-color: {$themeStore[currentTheme].primary};
                        --success-color: {$themeStore[currentTheme].success};
                        --error-color: {$themeStore[currentTheme].error};
                        --text-color: {$themeStore[currentTheme].text};
                        --background-color: {$themeStore[currentTheme].background};
                        --border-color: {$themeStore[currentTheme].border};
                        --disabled-color: {$themeStore[currentTheme].disabled};
                        --hover-color: {$themeStore[currentTheme].hover};
                        --card-color: {$themeStore[currentTheme].card};
                        --button-primary: {$themeStore[currentTheme].buttonPrimary};
                        --button-primary-text: {$themeStore[currentTheme].buttonPrimaryText};
                        --button-disabled: {$themeStore[currentTheme].buttonDisabled};
                        --button-disabled-text: {$themeStore[currentTheme].buttonDisabledText};
                        --button-error: {$themeStore[currentTheme].buttonError};
                        --button-error-text: {$themeStore[currentTheme].buttonErrorText};
                        --button-success: {$themeStore[currentTheme].buttonSuccess};
                        --button-success-text: {$themeStore[currentTheme].buttonSuccessText};
                        --button-processing: {$themeStore[currentTheme].buttonProcessing};
                        --button-processing-text: {$themeStore[currentTheme].buttonProcessingText};
                        --button-hover: {$themeStore[currentTheme].buttonHover};
                    ">
                        <header class="preview-header">
                            <div class="title-section">
                                <h2>Borrow 1000 USDC</h2>
                                <div class="subtitle">Variable Rolling Rate</div>
                            </div>
                            <button class="close-button">×</button>
                        </header>

                        <div class="preview-body">
                            <div class="transaction-list">
                                <div class="transaction-row">
                                    <div class="tx-info">Approve USDC</div>
                                    <button class="action-button active">Approve</button>
                                </div>
                                <div class="transaction-row">
                                    <div class="tx-info">Authorize auto-roll contract</div>
                                    <button class="action-button processing">
                                        <span class="spinner"></span>
                                        Pending...
                                        <span class="external-link-icon">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                <polyline points="15 3 21 3 21 9"/>
                                                <line x1="10" y1="14" x2="21" y2="3"/>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <div class="transaction-row">
                                    <div class="tx-info">Deposit and borrow</div>
                                    <a class="action-button success" href="#" tabindex="-1">
                                        Success
                                        <span class="external-link-icon">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                                <polyline points="15 3 21 3 21 9"/>
                                                <line x1="10" y1="14" x2="21" y2="3"/>
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                                <div class="transaction-row">
                                    <div class="tx-info">Sign auto-roll terms</div>
                                    <button class="action-button error">Retry</button>
                                </div>
                                <div class="transaction-row">
                                    <div class="tx-info">Withdraw collateral</div>
                                    <button class="action-button disabled" disabled>Disabled</button>
                                </div>
                            </div>
                        </div>

                        <footer class="preview-footer">
                            <div class="help-text">
                                Need help or have feedback? <button class="chat-link">Chat with someone</button>.
                            </div>
                        </footer>
                    </div>
                </div>
                <div class="theme-export-block">
                    <h4>Copy Theme Config ({currentTheme})</h4>
                    <pre><code>{JSON.stringify(customTheme[currentTheme], null, 4)}</code></pre>
                </div>
            </div>
        </section>
    </div>

   
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    h1 {
        color: #333;
        margin-bottom: 2rem;
    }

    .component-section {
        padding: 2rem;
        border: 1px solid #eee;
        border-radius: 8px;
        background: white;
         margin-bottom: 2rem;
    }

    .theme-section {
        margin-bottom: 0;
    }

    .preview-section {
        margin-bottom: 0;
    }

    h2 {
        color: #444;
        margin-bottom: 1.5rem;
    }

    h3 {
        color: #666;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }

    .component-demo {
        padding: 1.5rem;
        background: #f9f9f9;
        border-radius: 6px;
    }

    .preview-container {
        position: relative;
        min-height: 520px;
        min-width: 480px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9f9f9;
        border-radius: 8px;
        padding: 0;
        box-sizing: border-box;
        overflow: auto;
    }

    .preview-container.dark {
        background: #1a1a1a;
    }

    .preview-modal {
        width: 100%;
        max-width: 480px;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        overflow: hidden;
        color: var(--text-color);
        box-shadow: 0 8px 32px rgba(16, 30, 54, 0.12);
        margin: 0 auto;
    }

    .preview-header {
        margin-bottom: 24px;
        text-align: left;
        position: relative;
        padding: 32px 32px 0;
    }

    .title-section {
        text-align: center;
        flex: 1;
    }

    .preview-header h2 {
        font-size: 24px;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
    }

    .subtitle {
        font-size: 16px;
        color: var(--text-color);
        opacity: 0.7;
        margin-top: 4px;
    }

    .close-button {
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        border: none;
        font-size: 24px;
        color: var(--disabled-color);
        cursor: pointer;
    }

    .preview-body {
        padding: 0 32px 24px 32px;
    }

    .transaction-list {
        margin-bottom: 0;
    }

    .transaction-row {
        background: var(--card-color);
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tx-info {
        font-size: 16px;
        color: var(--text-color);
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

    .preview-footer {
        margin-top: 32px;
        text-align: center;
        padding: 0 32px 32px;
    }

    .help-text {
        font-size: 14px;
        color: var(--text-color);
        opacity: 0.7;
        font-weight: 400;
    }

    .chat-link {
        background: none;
        border: none;
        color: var(--primary-color);
        padding: 0;
        font-size: inherit;
        font-weight: 400;
        cursor: pointer;
    }

    .chat-link:hover {
        text-decoration: underline;
    }

    /* Dark theme */
    .dark .transaction-row {
        background: var(--card-color);
    }

    .dark .action-button.disabled {
        background: rgba(79, 127, 255, 0.1);
        color: var(--primary-color);
    }

    .theme-controls {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .theme-selector {
        display: flex;
        gap: 1rem;
    }

    .theme-selector button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
    }

    .theme-selector button.active {
        background: #4F7FFF;
        color: white;
        border-color: #4F7FFF;
    }

    .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .color-picker {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .color-picker label {
        font-size: 0.9rem;
        color: #666;
        text-transform: capitalize;
    }

    .color-input-wrapper {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .color-input-wrapper input[type="color"] {
        width: 60px;
        height: 60px;
        padding: 0;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        -webkit-appearance: none;
    }

    .color-input-wrapper input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    .color-input-wrapper input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: 2px;
    }

    .color-input-wrapper input[type="text"] {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9rem;
        min-width: 120px;
    }

    .reset-button {
        padding: 0.75rem;
        background: #f1f1f1;
        border: 1px solid #ddd;
        border-radius: 4px;
        color: #666;
        cursor: pointer;
    }

    .reset-button:hover {
        background: #e5e5e5;
    }

    .modal-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .modal-controls button {
        padding: 0.75rem 1.5rem;
        background: #4F7FFF;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .modal-controls button:hover {
        background: #3B66E5;
    }

    :global(body) {
        background: #f5f5f5;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    }

    .theme-export-block {
        margin-top: 2rem;
        background: #f4f4f4;
        border-radius: 6px;
        padding: 1rem;
        font-size: 0.95rem;
        overflow-x: auto;
    }
    .theme-export-block h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: #444;
    }
    .theme-export-block pre {
        margin: 0;
        background: none;
        padding: 0;
        font-size: 0.95rem;
        color: #222;
    }
    .theme-export-block code {
        font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
        background: none;
        color: #222;
    }

    .color-group {
        margin-bottom: 2rem;
    }
    .color-group h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: #444;
    }

    .rgba-swatch {
        width: 60px;
        height: 60px;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.75rem;
    }
    .rgba-note {
        font-size: 0.8rem;
        color: #888;
        margin-top: 0.25rem;
    }

    .toggle-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        color: #444;
    }
    .toggle-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
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
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Preview Modal Styles */
    .preview-modal-container {
        width: 480px;
        max-width: 100%;
    }

    .preview-modal-header {
        margin-bottom: 24px;
        text-align: left;
        position: relative;
    }

    .preview-modal-title-section {
        text-align: center;
        flex: 1;
    }

    .preview-modal-title {
        font-size: 24px;
        font-weight: 600;
        color: #111827;
    }

    .preview-modal-body {
        padding: 1rem;
    }

    .preview-modal-action-button {
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
        background: var(--button-primary, #4F7FFF);
        color: var(--button-primary-text, #fff);
    }

    .preview-modal-action-button .spinner {
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

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style> 
