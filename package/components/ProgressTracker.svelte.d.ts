import { SvelteComponent } from "svelte";
import type { Transaction, TransactionState } from '../types';
declare const __propDef: {
    props: {
        transactions?: Transaction[];
        states: Map<string, TransactionState>;
        currentIndex: number;
        theme?: "light" | "dark";
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ProgressTrackerProps = typeof __propDef.props;
export type ProgressTrackerEvents = typeof __propDef.events;
export type ProgressTrackerSlots = typeof __propDef.slots;
export default class ProgressTracker extends SvelteComponent<ProgressTrackerProps, ProgressTrackerEvents, ProgressTrackerSlots> {
}
export {};
