import type { Transaction, TransactionState } from '../types';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const TransactionModal: $$__sveltets_2_IsomorphicComponent<{
    isOpen?: boolean;
    transactions?: Transaction[];
    states: Map<string, TransactionState>;
    currentIndex: number;
    theme?: "light" | "dark";
    showSummary?: boolean;
    autoExecuteAfterApproval?: boolean;
    title?: string;
    subtitle?: string;
    positionsUrl?: string;
    socialLinks?: {
        x: string;
        warpcast: string;
        telegram: string;
    };
}, {
    click: MouseEvent;
    close: CustomEvent<void>;
    execute: CustomEvent<{
        transactionId: string;
    }>;
    retry: CustomEvent<{
        transactionId: string;
    }>;
    skip: CustomEvent<{
        transactionId: string;
    }>;
    cancel: CustomEvent<void>;
    chat: CustomEvent<void>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type TransactionModal = InstanceType<typeof TransactionModal>;
export default TransactionModal;
