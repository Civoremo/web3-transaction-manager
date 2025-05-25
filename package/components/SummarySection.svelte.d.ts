import { SvelteComponent } from "svelte";
import type { Transaction, TransactionState } from '../types';
declare const __propDef: {
    props: {
        transactions?: Transaction[];
        states: Map<string, TransactionState>;
        isComplete?: boolean;
        hasError?: boolean;
        explorerBaseUrl?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SummarySectionProps = typeof __propDef.props;
export type SummarySectionEvents = typeof __propDef.events;
export type SummarySectionSlots = typeof __propDef.slots;
export default class SummarySection extends SvelteComponent<SummarySectionProps, SummarySectionEvents, SummarySectionSlots> {
}
export {};
