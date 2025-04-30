<script lang="ts">
    import type { Transaction, TransactionState } from '../types';

    export let transactions: Transaction[] = [];
    export let states: Map<string, TransactionState>;
    export let currentIndex: number;

    $: progress = (currentIndex / transactions.length) * 100;
    $: completedSteps = transactions.filter((tx) => 
        states.get(tx.id)?.status === 'success'
    ).length;
    $: totalSteps = transactions.length;
</script>

<div class="progress-tracker">
    <div class="progress-bar">
        <div 
            class="progress-fill"
            style="width: {progress}%"
            class:completed={progress === 100}
        />
    </div>
    
    <div class="steps">
        {#each transactions as tx, index}
            {@const state = states.get(tx.id)}
            <div 
                class="step"
                class:active={index === currentIndex}
                class:completed={state?.status === 'success'}
                class:failed={state?.status === 'failed'}
            >
                <div class="step-indicator">
                    {#if state?.status === 'success'}
                        ✓
                    {:else if state?.status === 'failed'}
                        ✗
                    {:else}
                        {index + 1}
                    {/if}
                </div>
                <div class="step-label">
                    {tx.metadata?.title || `Transaction ${index + 1}`}
                </div>
            </div>
        {/each}
    </div>

    <div class="progress-text">
        {completedSteps} of {totalSteps} transactions completed
    </div>
</div>

<style>
    .progress-tracker {
        width: 100%;
        padding: 1rem;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: #eee;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .progress-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.3s ease;
    }

    .progress-fill.completed {
        background: #4CAF50;
    }

    .steps {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        text-align: center;
    }

    .step-indicator {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }

    .step.active .step-indicator {
        background: #2196F3;
        color: white;
    }

    .step.completed .step-indicator {
        background: #4CAF50;
        color: white;
    }

    .step.failed .step-indicator {
        background: #f44336;
        color: white;
    }

    .step-label {
        font-size: 0.875rem;
        color: #666;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .progress-text {
        text-align: center;
        font-size: 0.875rem;
        color: #666;
    }
</style> 