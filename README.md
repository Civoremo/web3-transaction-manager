# Web3 Transaction Manager

A Svelte component library for managing multi-step blockchain transactions with a beautiful, user-friendly interface.

## Features

- 🎯 Multi-step transaction management
- 🎨 Modern, clean UI with dark mode support
- 🔄 Automatic transaction state tracking
- 🔗 Block explorer integration
- 🚀 Retry functionality for failed transactions
- 📱 Responsive design
- 🎭 Customizable themes and styling

## Installation

```bash
npm install web3-transaction-manager
```

## Quick Start

```svelte
<script>
    import { TransactionModal } from 'web3-transaction-manager';
    import { ethers } from 'ethers';

    let isOpen = false;
    let signer = new ethers.Signer();
    let transactions = [
        {
            id: 'approve',
            type: 'approval',
            params: {
                to: '0x...',
                data: '0x...'
            },
            metadata: {
                title: 'Approve USDC',
                buttonLabel: 'Approve'
            }
        }
    ];
</script>

<TransactionModal
    {isOpen}
    {transactions}
    {signer}
    blockExplorerUrl="https://etherscan.io/tx/"
    title="Borrow 1000 USDC"
    subtitle="Variable Rolling Rate"
    positionsUrl="/positions"
    socialLinks={{
        x: 'https://x.com/your-handle',
        warpcast: 'https://warpcast.com/your-handle',
        telegram: 'https://t.me/your-channel'
    }}
    supportChannelUrl="https://t.me/your-support"
    on:close={() => isOpen = false}
/>
```

## Props

### Required Props

- `transactions`: Array of `Transaction` objects to be executed
- `signer`: ethers.Signer instance for transaction signing
- `blockExplorerUrl`: Base URL for the block explorer (e.g., 'https://etherscan.io/tx/' for Ethereum)

### Optional Props

- `isOpen`: Boolean to control modal visibility (default: false)
- `theme`: 'light' | 'dark' (default: 'light')
- `showSummary`: Boolean to show transaction summary (default: false)
- `title`: Modal title (default: 'Borrow 1000 USDC')
- `subtitle`: Modal subtitle (default: 'Variable Rolling Rate')
- `positionsUrl`: URL for the positions page (default: '#')
- `socialLinks`: Object containing social media URLs
- `supportChannelUrl`: URL for the support channel

## Events

- `close`: Dispatched when the modal is closed
- `execute`: Dispatched when a transaction is executed
- `skip`: Dispatched when a transaction is skipped
- `cancel`: Dispatched when the transaction flow is cancelled

## Types

```typescript
interface Transaction {
    id: string;
    type: TransactionType;
    params: {
        to: string;
        data: string;
        value?: string;
    };
    metadata: {
        title: string;
        buttonLabel: string;
    };
}

/**
 * Transaction types for different kinds of blockchain transactions
 * - 'approval': Token approval transactions (e.g., approving USDC for a protocol)
 * - 'contract': Smart contract interaction transactions (e.g., calling contract functions)
 * - 'standard': Standard ETH transfers or simple transactions
 */
type TransactionType = 'approval' | 'contract' | 'standard';
type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed';
```

## Styling

The components use a clean, modern design with support for both light and dark themes. The styling is scoped to each component and uses CSS custom properties for easy theming.

### Colors

- Primary: #4F7FFF
- Success: #10B981
- Error: #DC2626
- Text: #111827
- Background: #FFFFFF (light) / #1F2937 (dark)

### Typography

- Font Family: System UI
- Headings: 24px, 600 weight
- Body: 16px, 400 weight
- Buttons: 14px, 500 weight

## Best Practices

1. Always provide a `blockExplorerUrl` appropriate for the chain being used
2. Handle transaction errors gracefully
3. Provide clear feedback for transaction states
4. Use appropriate social media and support channel URLs
5. Consider implementing retry logic for failed transactions
6. Test thoroughly on different networks and with different transaction types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Theme Customization

You can fully customize the appearance of the TransactionModal and related components by passing a `customTheme` prop. This prop accepts a `ThemeConfig` object with separate color sets for `light` and `dark` themes.

### Available Theme Parameters

Each theme (light/dark) supports the following fields:

```typescript
interface ThemeColors {
    primary: string;
    success: string;
    error: string;
    text: string;
    background: string;
    border: string;
    disabled: string;
    hover: string;
    card?: string; // Action container background
    // Button colors
    buttonPrimary?: string;
    buttonPrimaryText?: string;
    buttonDisabled?: string;
    buttonDisabledText?: string;
    buttonError?: string;
    buttonErrorText?: string;
    buttonSuccess?: string;
    buttonSuccessText?: string;
    buttonProcessing?: string;
    buttonProcessingText?: string;
    buttonHover?: string;
}

interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}
```

### Example

```typescript
const customTheme = {
    light: {
        primary: '#4F7FFF',
        success: '#10B981',
        error: '#DC2626',
        text: '#111827',
        background: '#FFFFFF',
        border: '#E5E7EB',
        disabled: '#9CA3AF',
        hover: '#3B82F6',
        card: '#F7F7FA',
        buttonPrimary: '#4F7FFF',
        buttonPrimaryText: '#FFFFFF',
        buttonDisabled: 'rgba(79,127,255,0.1)',
        buttonDisabledText: '#4F7FFF',
        buttonError: '#DC2626',
        buttonErrorText: '#FFFFFF',
        buttonSuccess: '#FFFFFF',
        buttonSuccessText: '#64748B',
        buttonProcessing: '#4F7FFF',
        buttonProcessingText: '#FFFFFF',
        buttonHover: '#3B66E5',
    },
    dark: {
        primary: '#4F7FFF',
        success: '#10B981',
        error: '#DC2626',
        text: '#FFFFFF',
        background: '#1F2937',
        border: '#374151',
        disabled: '#9CA3AF',
        hover: '#3B82F6',
        card: '#374151',
        buttonPrimary: '#4F7FFF',
        buttonPrimaryText: '#FFFFFF',
        buttonDisabled: 'rgba(79,127,255,0.1)',
        buttonDisabledText: '#4F7FFF',
        buttonError: '#DC2626',
        buttonErrorText: '#FFFFFF',
        buttonSuccess: '#1F2937',
        buttonSuccessText: '#9CA3AF',
        buttonProcessing: '#4F7FFF',
        buttonProcessingText: '#FFFFFF',
        buttonHover: '#3B66E5',
    }
};
```

You can pass this object to the `customTheme` prop of `TransactionModal`:

```svelte
<TransactionModal
    customTheme={customTheme}
    ...
/>
```

All color fields are optional; any omitted field will fall back to the default theme value.

