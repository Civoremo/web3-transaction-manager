<script lang="ts">
    import type { Transaction, TransactionState } from '../types';

    export let transactions: Transaction[] = [];
    export let states: Map<string, TransactionState>;
    export let currentIndex: number;

    // Calculate progress segments for different states
    $: progressSegments = transactions.map((tx, index) => {
        const state = states.get(tx.id)?.status;
        const segmentWidth = (1 / transactions.length) * 100;
        return {
            width: segmentWidth,
            left: index * segmentWidth,
            state
        };
    });

    $: completedSteps = transactions.filter((tx) => 
        states.get(tx.id)?.status === 'success'
    ).length;
    $: totalSteps = transactions.length;
</script>

<div class="progress-tracker">
    <div class="progress-bar">
        {#each progressSegments as segment}
            <div 
                class="progress-segment"
                class:success={segment.state === 'success'}
                class:failed={segment.state === 'failed'}
                class:skipped={segment.state === 'skipped'}
                class:cancelled={segment.state === 'cancelled'}
                class:processing={segment.state === 'processing'}
                style="width: {segment.width}%; left: {segment.left}%"
            />
        {/each}
    </div>
    
    <div class="steps">
        {#each transactions as tx, index}
            {@const state = states.get(tx.id)}
            <div 
                class="step"
                class:active={index === currentIndex}
                class:success={state?.status === 'success'}
                class:failed={state?.status === 'failed'}
                class:skipped={state?.status === 'skipped'}
                class:cancelled={state?.status === 'cancelled'}
                class:processing={state?.status === 'processing'}
            >
                <div class="step-indicator">
                    {#if state?.status === 'success'}
                        ✓
                    {:else if state?.status === 'failed'}
                        ✗
                    {:else if state?.status === 'skipped'}
                        ⤳
                    {:else if state?.status === 'cancelled'}
                        ⨯
                    {:else if state?.status === 'processing'}
                        •
                    {:else}
                        {index + 1}
                    {/if}
                </div>
                <div class="step-label">
                    {tx.metadata?.title || `Transaction ${index + 1}`}
                </div>
                {#if state?.status}
                    <div class="step-status" class:active={index === currentIndex}>
                        {state.status}
                    </div>
                {/if}
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
        position: relative;
    }

    .progress-segment {
        height: 100%;
        position: absolute;
        top: 0;
        background: #eee; /* Default gray for pending */
        transition: background-color 0.3s ease;
    }

    .progress-segment.success {
        background: #4CAF50; /* Green */
    }

    .progress-segment.failed {
        background: #f44336; /* Red */
    }

    .progress-segment.skipped {
        background: #ff9800; /* Orange */
    }

    .progress-segment.cancelled {
        background: #9e9e9e; /* Gray */
    }

    .progress-segment.processing {
        background: #2196F3; /* Blue */
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }

    .steps {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        position: relative;
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        text-align: center;
        position: relative;
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
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .step.active .step-indicator {
        background: #2196F3;
        color: white;
        transform: scale(1.1);
        box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
    }

    .step.success .step-indicator {
        background: #4CAF50;
        color: white;
    }

    .step.failed .step-indicator {
        background: #f44336;
        color: white;
    }

    .step.skipped .step-indicator {
        background: #ff9800;
        color: white;
    }

    .step.cancelled .step-indicator {
        background: #9e9e9e;
        color: white;
    }

    .step.processing .step-indicator {
        background: #2196F3;
        color: white;
        animation: pulse 2s infinite;
    }

    .step-label {
        font-size: 0.875rem;
        color: #666;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 0.25rem;
    }

    .step-status {
        font-size: 0.75rem;
        color: #999;
        text-transform: capitalize;
        opacity: 0.8;
    }

    .step-status.active {
        opacity: 1;
        font-weight: 500;
    }

    .progress-text {
        text-align: center;
        font-size: 0.875rem;
        color: #666;
        margin-top: 1rem;
    }

    /* Dark theme support */
    :global(.dark) .progress-bar {
        background: #333;
    }

    :global(.dark) .progress-segment {
        background: #444;
    }

    :global(.dark) .step-indicator {
        background: #444;
        color: #fff;
    }

    :global(.dark) .step-label {
        color: #aaa;
    }

    :global(.dark) .step-status {
        color: #888;
    }

    :global(.dark) .progress-text {
        color: #aaa;
    }
</style> 