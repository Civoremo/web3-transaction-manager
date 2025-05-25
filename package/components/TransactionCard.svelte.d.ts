import { SvelteComponent } from "svelte";
import type { Transaction, TransactionState } from '../types';
declare const __propDef: {
    props: {
        transaction: Transaction;
        state: TransactionState | undefined;
        onExecute: () => void;
        onRetry: () => void;
        theme?: "light" | "dark";
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type TransactionCardProps = typeof __propDef.props;
export type TransactionCardEvents = typeof __propDef.events;
export type TransactionCardSlots = typeof __propDef.slots;
export default class TransactionCard extends SvelteComponent<TransactionCardProps, TransactionCardEvents, TransactionCardSlots> {
}
export {};
