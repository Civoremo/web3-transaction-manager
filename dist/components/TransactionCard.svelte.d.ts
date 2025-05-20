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
declare const TransactionCard: $$__sveltets_2_IsomorphicComponent<{
    transaction: Transaction;
    state: TransactionState | undefined;
    onExecute: () => void;
    onRetry: () => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type TransactionCard = InstanceType<typeof TransactionCard>;
export default TransactionCard;
