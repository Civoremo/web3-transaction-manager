# Web3 Transaction Manager

A Svelte component library for managing multi-step blockchain transactions with a beautiful, user-friendly interface.

## Components

### TransactionModal

A modal component that handles multi-step blockchain transactions with a clean, modern interface.

#### Props

Required:
- `transactions`: Array of `Transaction` objects to be executed
- `signer`: ethers.Signer instance for transaction signing
- `blockExplorerUrl`: Base URL for the block explorer (e.g., 'https://etherscan.io/tx/' for Ethereum)

Optional:
- `isOpen`: Boolean to control modal visibility (default: false)
- `theme`: 'light' | 'dark' (default: 'light')
- `showSummary`: Boolean to show transaction summary (default: false)
- `title`: Modal title (default: 'Borrow 1000 USDC')
- `subtitle`: Modal subtitle (default: 'Variable Rolling Rate')
- `positionsUrl`: URL for the positions page (default: '#')
- `socialLinks`: Object containing social media URLs
  ```typescript
  {
    x: string;
    warpcast: string;
    telegram: string;
  }
  ```
- `supportChannelUrl`: URL for the support channel

#### Events

- `close`: Dispatched when the modal is closed
- `execute`: Dispatched when a transaction is executed
- `skip`: Dispatched when a transaction is skipped
- `cancel`: Dispatched when the transaction flow is cancelled

#### Usage

```svelte
<script>
    import { TransactionModal } from '$lib';
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

### ProgressTracker

A component that displays the progress of multi-step transactions.

#### Props

- `steps`: Array of step objects
- `currentStep`: Index of the current step
- `theme`: 'light' | 'dark'

### TransactionCard

A component that displays individual transaction information.

#### Props

- `transaction`: Transaction object
- `status`: Transaction status
- `theme`: 'light' | 'dark'

### SummarySection

A component that displays a summary of completed transactions.

#### Props

- `transactions`: Array of completed transactions
- `theme`: 'light' | 'dark'

## Types

### Transaction

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