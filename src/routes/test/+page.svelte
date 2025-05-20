# Test Page - Web3 Transaction Manager

<script lang="ts">
    import { TransactionModal } from '$lib';
    import { TEST_TRANSACTION_FLOW } from '$lib/mocks/testTransactionFlow';
    import { TestMockSigner } from './testMockSigner';

    let isModalOpen = false;
    let signer = new TestMockSigner();
    let theme: 'light' | 'dark' = 'light';
    let allTransactionsComplete = false;

    function handleSuccess(event) {
        console.log('Transaction success:', event.detail);
        // Check if this was the last transaction
        if (event.detail.transactionId === TEST_TRANSACTION_FLOW[TEST_TRANSACTION_FLOW.length - 1].id) {
            allTransactionsComplete = true;
        }
    }

    function handleError(event) {
        console.error('Transaction error:', event.detail);
    }

    function handleClose() {
        isModalOpen = false;
        allTransactionsComplete = false;
    }
</script>

<button on:click={() => isModalOpen = true}>Open Transaction Flow</button>
<TransactionModal
    isOpen={isModalOpen}
    transactions={TEST_TRANSACTION_FLOW}
    signer={signer}
    theme={theme}
    positionsUrl="/positions"
    on:close={handleClose}
    on:success={handleSuccess}
    on:error={handleError}
/>

<div class="container">
    <h1>Web3 Transaction Manager - Component Test Page</h1>
    <section class="component-section">
        <h2>TransactionModal Component</h2>
        <div class="component-demo">
            <div class="modal-controls">
                <button on:click={() => isModalOpen = true}>Open Transaction Flow</button>
                <div class="theme-controls">
                    <label>
                        <input 
                            type="radio" 
                            name="theme" 
                            value="light" 
                            bind:group={theme}
                        > Light
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="theme" 
                            value="dark" 
                            bind:group={theme}
                        > Dark
                    </label>
                </div>
            </div>
            <TransactionModal
                isOpen={isModalOpen}
                transactions={TEST_TRANSACTION_FLOW}
                signer={signer}
                theme={theme}
                positionsUrl="/positions"
                on:close={handleClose}
                on:success={handleSuccess}
                on:error={handleError}
            />
        </div>
    </section>
    <section class="component-section">
        <h2>🚧 SummarySection Component</h2>
        <div class="component-demo">
            <p>Coming soon...</p>
        </div>
    </section>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #333;
        margin-bottom: 2rem;
    }

    .component-section {
        margin-bottom: 3rem;
        padding: 2rem;
        border: 1px solid #eee;
        border-radius: 8px;
        background: white;
    }

    h2 {
        color: #444;
        margin-bottom: 1.5rem;
    }

    .component-demo {
        padding: 1.5rem;
        background: #f9f9f9;
        border-radius: 6px;
    }

    .modal-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .theme-controls {
        display: flex;
        gap: 1rem;
    }

    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    :global(body) {
        background: #f5f5f5;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    }
</style> 