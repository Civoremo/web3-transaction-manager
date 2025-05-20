<script lang="ts">
    import type { Transaction, TransactionState } from '../types';

    export let transactions: Transaction[] = [];
    export let states: Map<string, TransactionState>;
    export let currentIndex: number;
    export let theme: 'light' | 'dark' = 'light';

    $: progress = calculateProgress();

    function calculateProgress(): number {
        if (transactions.length === 0) return 0;
        
        const completed = transactions.filter(tx => 
            states.get(tx.id)?.status === 'success'
        ).length;

        return (completed / transactions.length) * 100;
    }

    function getSegmentClass(index: number): string {
        const tx = transactions[index];
        if (!tx) return '';

        const state = states.get(tx.id);
        if (!state) return '';

        switch (state.status) {
            case 'success':
                return 'success';
            case 'failed':
                return 'error';
            case 'processing':
                return 'processing';
            case 'skipped':
                return 'skipped';
            default:
                return '';
        }
    }
</script>

<div class="progress-tracker" class:dark={theme === 'dark'}>
    <div class="progress-bar">
        <div 
            class="progress-fill"
            style="width: {progress}%"
        ></div>
        
        <div class="segments">
            {#each transactions as _, i}
                <div 
                    class="segment {getSegmentClass(i)}"
                    class:active={i === currentIndex}
                ></div>
            {/each}
        </div>
    </div>
    
    <div class="progress-text">
        {Math.round(progress)}% Complete
    </div>
</div>

<style>
    .progress-tracker {
        padding: 1rem;
        background: white;
        border-radius: 12px;
    }

    .progress-bar {
        position: relative;
        height: 8px;
        background: #f1f5f9;
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #2461ff;
        transition: width 0.3s ease;
    }

    .segments {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
    }

    .segment {
        flex: 1;
        height: 100%;
        border-right: 2px solid white;
    }

    .segment:last-child {
        border-right: none;
    }

    .segment.success {
        background: #22c55e;
    }

    .segment.error {
        background: #dc2626;
    }

    .segment.processing {
        background: #2461ff;
        animation: pulse 2s infinite;
    }

    .segment.skipped {
        background: #f59e0b;
    }

    .segment.active {
        box-shadow: 0 0 0 2px #2461ff;
    }

    .progress-text {
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: #64748b;
        text-align: center;
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }

    /* Dark theme */
    .dark {
        background: #1a1a1a;
    }

    .dark .progress-bar {
        background: #2a2a2a;
    }

    .dark .segment {
        border-color: #1a1a1a;
    }

    .dark .progress-text {
        color: #94a3b8;
    }
</style> 