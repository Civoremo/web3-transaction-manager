import { SvelteComponent } from "svelte";
import type { Transaction } from '../types';
import * as ethers from 'ethers';
declare const __propDef: {
    props: {
        isOpen?: boolean;
        transactions?: Transaction[];
        signer: ethers.Signer;
        address: string;
        theme?: "light" | "dark";
        title?: string;
        subtitle?: string;
        redirectUrl?: string;
        socialLinks?: Array<{
            label: string;
            url: string;
        }>;
        blockExplorerUrl: string;
        supportChannelUrl?: string;
        closeOnOverlayClick?: boolean;
        successMessage?: string;
        redirectMessage?: string;
        showHelpSection?: boolean;
        helpMessage?: string;
        helpRedirectText?: string;
        showFinalSuccessScreen?: boolean;
        transactionStatuses: any;
        customTheme?: {};
    };
    events: {
        click: MouseEvent;
        close: CustomEvent<any>;
        txExecute: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type TransactionModalProps = typeof __propDef.props;
export type TransactionModalEvents = typeof __propDef.events;
export type TransactionModalSlots = typeof __propDef.slots;
export default class TransactionModal extends SvelteComponent<TransactionModalProps, TransactionModalEvents, TransactionModalSlots> {
}
export {};
