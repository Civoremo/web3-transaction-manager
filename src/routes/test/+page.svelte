# Test Page - Web3 Transaction Manager

<script lang="ts">
    import { onMount } from 'svelte';
    import ProgressTracker from '$lib/components/ProgressTracker.svelte';
    import TransactionCard from '$lib/components/TransactionCard.svelte';
    import TransactionModal from '$lib/components/TransactionModal.svelte';
    import { TEST_TRANSACTION_FLOW as mockTransactions } from '$lib/mocks/testTransactionFlow';
    import {
        testScenarios,
        sampleTransaction,
        createProcessingState,
        createPendingState,
        createSuccessState,
        createFailedState,
        createSkippedState,
        createCancelledState,
        errorMessages
    } from '$lib/test/mockData';

    // Initialize states for all transactions
    let mockStates = new Map(mockTransactions.map(tx => [tx.id, createPendingState()]));
    let showModal = false;
    let currentIndex = 0;
    let theme: 'light' | 'dark' = 'light';
    let selectedScenario = 'initial';
    let autoProgress = false;
    let autoExecuteAfterApproval = false;
    let progressInterval: number;
    let processingStartTime = new Map<string, number>();
    let processingDuration = new Map<string, number>();
    let durationInterval: number;
    let showSummary = false;

    // Update processing durations every second
    function updateDurations() {
        const now = Date.now();
        processingDuration = new Map(
            Array.from(processingStartTime.entries()).map(([txId, startTime]) => [
                txId,
                Math.floor((now - startTime) / 1000)
            ])
        );
    }

    // Load selected scenario
    function loadScenario(scenario: keyof typeof testScenarios) {
        switch (scenario) {
            case 'complete':
                mockStates = new Map(mockTransactions.map(tx => [tx.id, createSuccessState()]));
                currentIndex = mockTransactions.length;
                break;
            case 'failedExecution':
                mockStates = new Map(mockTransactions.map((tx, index) => [
                    tx.id,
                    index === 0 ? createSuccessState() :
                    index === 1 ? createFailedState(errorMessages.insufficientFunds) :
                    createPendingState()
                ]));
                currentIndex = 1;
                break;
            case 'approvalFlow':
                mockStates = new Map(mockTransactions.map((tx, index) => [
                    tx.id,
                    index === 0 ? createProcessingState() : createPendingState()
                ]));
                currentIndex = 0;
                break;
            case 'skippedTransaction':
                mockStates = new Map(mockTransactions.map((tx, index) => [
                    tx.id,
                    index === 0 ? createSuccessState() :
                    index === 1 ? createSkippedState() :
                    createPendingState()
                ]));
                currentIndex = 2;
                break;
            case 'cancelledFlow':
                mockStates = new Map(mockTransactions.map((tx, index) => [
                    tx.id,
                    index === 0 ? createSuccessState() :
                    index === 1 ? createFailedState(errorMessages.insufficientFunds) :
                    createCancelledState()
                ]));
                currentIndex = 1;
                break;
            default:
                mockStates = new Map(mockTransactions.map(tx => [tx.id, createPendingState()]));
                currentIndex = 0;
                break;
        }
        
        selectedScenario = scenario;
        showSummary = scenario === 'complete' || scenario === 'cancelledFlow';
        
        // Reset processing times
        processingStartTime = new Map();
        processingDuration = new Map();
    }

    // Simulate transaction progress
    function simulateProgress() {
        const tx = mockTransactions[currentIndex];
        if (!tx) return;

        const currentState = mockStates.get(tx.id)?.status;
        
        switch (currentState) {
            case 'pending':
                mockStates = new Map(mockStates).set(tx.id, createProcessingState());
                processingStartTime.set(tx.id, Date.now());
                processingDuration.set(tx.id, 0);
                // Add 1-second delay before next state change
                setTimeout(() => {
                    if (mockStates.get(tx.id)?.status === 'processing') {
                        const success = Math.random() > 0.3;
                        mockStates = new Map(mockStates).set(
                            tx.id, 
                            success ? 
                                createSuccessState() : 
                                createFailedState(errorMessages.insufficientFunds)
                        );
                        if (success && currentIndex < mockTransactions.length) {
                            currentIndex++;
                        }
                        // Clear processing time
                        processingStartTime.delete(tx.id);
                        processingDuration.delete(tx.id);
                    }
                }, 1000);
                break;
            case 'failed':
                mockStates = new Map(mockStates).set(tx.id, createPendingState());
                break;
        }

        // Check if all transactions are complete or cancelled
        const allComplete = Array.from(mockStates.values()).every(
            state => ['success', 'skipped', 'cancelled'].includes(state.status)
        );
        if (allComplete) {
            showSummary = true;
            autoProgress = false;
            if (progressInterval) clearInterval(progressInterval);
        }
    }

    function handleExecute(event: CustomEvent<{ transactionId: string }>) {
        const txId = event.detail.transactionId;
        console.log('Execute clicked for transaction:', txId);
        mockStates = new Map(mockStates).set(txId, createProcessingState());
        processingStartTime.set(txId, Date.now());
        processingDuration.set(txId, 0);
        
        // Always process the transaction after a delay
        setTimeout(() => {
            if (mockStates.get(txId)?.status === 'processing') {
                const success = Math.random() > 0.3;
                mockStates = new Map(mockStates).set(
                    txId,
                    success ? 
                        createSuccessState() : 
                        createFailedState(errorMessages.insufficientFunds)
                );
                if (success) {
                    currentIndex++;
                } else if (autoExecuteAfterApproval) {
                    // If auto-execute is on and transaction fails, turn it off
                    autoExecuteAfterApproval = false;
                }
                
                // Clear processing time
                processingStartTime.delete(txId);
                processingDuration.delete(txId);

                // Check if all transactions are complete
                const allComplete = Array.from(mockStates.values()).every(
                    state => ['success', 'skipped', 'cancelled'].includes(state.status)
                );
                if (allComplete) {
                    showSummary = true;
                    autoProgress = false;
                    autoExecuteAfterApproval = false;
                    if (progressInterval) clearInterval(progressInterval);
                }
            }
        }, 1000);
    }

    function handleRetry(event: CustomEvent<{ transactionId: string }>) {
        const txId = event.detail.transactionId;
        console.log('Retry clicked for transaction:', txId);
        
        // Instead of setting to pending, immediately start processing
        mockStates = new Map(mockStates).set(txId, createProcessingState());
        processingStartTime.set(txId, Date.now());
        processingDuration.set(txId, 0);
        
        // Process the transaction after a delay
        setTimeout(() => {
            if (mockStates.get(txId)?.status === 'processing') {
                const success = Math.random() > 0.3;
                mockStates = new Map(mockStates).set(
                    txId,
                    success ? 
                        createSuccessState() : 
                        createFailedState(errorMessages.insufficientFunds)
                );
                if (success) {
                    currentIndex++;
                }
                
                // Clear processing time
                processingStartTime.delete(txId);
                processingDuration.delete(txId);

                // Check if all transactions are complete
                const allComplete = Array.from(mockStates.values()).every(
                    state => ['success', 'skipped', 'cancelled'].includes(state.status)
                );
                if (allComplete) {
                    showSummary = true;
                    autoProgress = false;
                    if (progressInterval) clearInterval(progressInterval);
                }
            }
        }, 1000);
    }

    function handleSkip(event: CustomEvent<{ transactionId: string }>) {
        const txId = event.detail.transactionId;
        console.log('Skip clicked for transaction:', txId);
        mockStates = new Map(mockStates).set(txId, createSkippedState());
        processingStartTime.delete(txId);
        processingDuration.delete(txId);
        currentIndex++;
    }

    function handleCancel() {
        console.log('Cancel clicked');
        // Mark all pending transactions as cancelled
        mockStates = new Map(
            Array.from(mockStates.entries()).map(([txId, state]) => [
                txId,
                state.status === 'pending' ? createCancelledState() : state
            ])
        );
        showSummary = true;
        autoProgress = false;
        if (progressInterval) clearInterval(progressInterval);
    }

    function toggleAutoProgress() {
        autoProgress = !autoProgress;
        if (autoProgress) {
            progressInterval = setInterval(simulateProgress, 2000);
        } else {
            clearInterval(progressInterval);
        }
    }

    onMount(() => {
        // Start duration update interval
        durationInterval = setInterval(updateDurations, 1000);
        
        return () => {
            if (progressInterval) clearInterval(progressInterval);
            if (durationInterval) clearInterval(durationInterval);
        };
    });
</script>

<div class="container">
    <h1>Web3 Transaction Manager - Component Test Page</h1>

    <section class="component-section">
        <h2>Test Controls</h2>
        <div class="component-demo">
            <div class="test-controls">
                <div class="scenario-controls">
                    <h3>Load Scenario:</h3>
                    <div class="button-group">
                        <button 
                            class:active={selectedScenario === 'initial'}
                            on:click={() => loadScenario('initial')}
                        >
                            Initial
                        </button>
                        <button 
                            class:active={selectedScenario === 'approvalFlow'}
                            on:click={() => loadScenario('approvalFlow')}
                        >
                            Approval Flow
                        </button>
                        <button 
                            class:active={selectedScenario === 'failedExecution'}
                            on:click={() => loadScenario('failedExecution')}
                        >
                            Failed Execution
                        </button>
                        <button 
                            class:active={selectedScenario === 'skippedTransaction'}
                            on:click={() => loadScenario('skippedTransaction')}
                        >
                            Skipped Transaction
                        </button>
                        <button 
                            class:active={selectedScenario === 'cancelledFlow'}
                            on:click={() => loadScenario('cancelledFlow')}
                        >
                            Cancelled Flow
                        </button>
                        <button 
                            class:active={selectedScenario === 'complete'}
                            on:click={() => loadScenario('complete')}
                        >
                            Complete
                        </button>
                    </div>
                </div>

                <div class="auto-progress">
                    <label>
                        <input 
                            type="checkbox" 
                            bind:checked={autoProgress} 
                            on:change={toggleAutoProgress}
                        >
                        Auto Progress
                    </label>
                    <button on:click={simulateProgress} disabled={autoProgress}>
                        Step Forward
                    </button>
                </div>

                <div class="action-controls">
                    <button 
                        on:click={handleCancel} 
                        disabled={showSummary}
                    >
                        Cancel All Pending
                    </button>
                </div>
            </div>
        </div>
    </section>
    
    <section class="component-section">
        <h2>✅ ProgressTracker Component</h2>
        <div class="component-demo">
            <ProgressTracker 
                transactions={mockTransactions}
                states={mockStates}
                currentIndex={currentIndex}
            />
        </div>
    </section>

    <section class="component-section">
        <h2>✅ TransactionCard Component</h2>
        <div class="component-demo">
            <h3>Pending Transaction</h3>
            <TransactionCard 
                transaction={sampleTransaction}
                state={{ status: 'pending' }}
                onExecute={() => console.log('Execute clicked')}
                onRetry={() => console.log('Retry clicked')}
            />
            
            <h3>Processing Transaction</h3>
            <div class="processing-demo">
                <TransactionCard 
                    transaction={sampleTransaction}
                    state={{ status: 'processing' }}
                    onExecute={() => console.log('Execute clicked')}
                    onRetry={() => console.log('Retry clicked')}
                />
                <div class="processing-overlay">
                    <div class="spinner"></div>
                    <div class="duration">Processing... (0s)</div>
                </div>
            </div>
            
            <h3>Failed Transaction</h3>
            <TransactionCard 
                transaction={sampleTransaction}
                state={{ status: 'failed' }}
                onExecute={() => console.log('Execute clicked')}
                onRetry={() => console.log('Retry clicked')}
            />
            
            <h3>Successful Transaction</h3>
            <TransactionCard 
                transaction={sampleTransaction}
                state={{ status: 'success' }}
                onExecute={() => console.log('Execute clicked')}
                onRetry={() => console.log('Retry clicked')}
            />
        </div>
    </section>

    <section class="component-section">
        <h2>✅ TransactionModal Component</h2>
        <div class="component-demo">
            <div class="modal-controls">
                <button on:click={() => showModal = true}>Open Transaction Modal</button>
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
                isOpen={showModal}
                transactions={mockTransactions}
                states={mockStates}
                currentIndex={currentIndex}
                theme={theme}
                showSummary={showSummary}
                {autoExecuteAfterApproval}
                on:close={() => showModal = false}
                on:execute={handleExecute}
                on:retry={handleRetry}
                on:skip={handleSkip}
                on:cancel={handleCancel}
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

    h3 {
        color: #666;
        margin: 1rem 0;
    }

    .component-demo {
        padding: 1.5rem;
        background: #f9f9f9;
        border-radius: 6px;
    }

    .test-controls {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .scenario-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .button-group {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    button {
        padding: 0.5rem 1rem;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s;
    }

    button:hover:not(:disabled) {
        background: #45a049;
    }

    button:disabled {
        background: #cccccc;
        cursor: not-allowed;
    }

    button.active {
        background: #2E7D32;
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

    .auto-progress {
        display: flex;
        align-items: center;
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

    .processing-demo {
        position: relative;
    }

    .processing-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        border-radius: 6px;
    }

    .spinner {
        width: 30px;
        height: 30px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #4CAF50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .duration {
        font-size: 0.9rem;
        color: #666;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    :global(.dark) .processing-overlay {
        background: rgba(0, 0, 0, 0.8);
    }

    :global(.dark) .duration {
        color: #ccc;
    }

    :global(.dark) .spinner {
        border-color: #333;
        border-top-color: #4CAF50;
    }

    .action-controls {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .action-controls button {
        background: #f44336;
    }

    .action-controls button:hover:not(:disabled) {
        background: #d32f2f;
    }
</style> 