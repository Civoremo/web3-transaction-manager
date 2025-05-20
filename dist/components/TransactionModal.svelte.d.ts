import type { Transaction } from '../types';
import { ethers } from 'ethers';
import type { ThemeConfig } from '../types/theme';
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
    signer: ethers.Signer;
    theme?: "light" | "dark";
    showSummary?: boolean;
    title?: string;
    subtitle?: string;
    positionsUrl?: string;
    socialLinks?: {
        x: string;
        warpcast: string;
        telegram: string;
    };
    blockExplorerUrl: string;
    supportChannelUrl?: string;
    customTheme?: Partial<ThemeConfig>;
    closeOnOverlayClick?: boolean;
}, {
    click: MouseEvent;
    keydown: KeyboardEvent;
    close: CustomEvent<any>;
    execute: CustomEvent<any>;
    skip: CustomEvent<any>;
    cancel: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type TransactionModal = InstanceType<typeof TransactionModal>;
export default TransactionModal;
