# Web3 Transaction Manager

A Svelte component library for managing multi-step blockchain transactions with a beautiful, user-friendly interface.

## Components

### TransactionModal

A modal component that handles multi-step blockchain transactions with a clean, modern interface.

#### Props

Required:
- `transactions`: Array of `Transaction` objects to be executed
- `signer`: ethers.Signer instance for transaction signing

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
- `customTheme`: Custom theme configuration
  ```typescript
  {
    light?: {
      primary?: string;
      success?: string;
      error?: string;
      text?: string;
      background?: string;
      border?: string;
      disabled?: string;
      hover?: string;
    };
    dark?: {
      primary?: string;
      success?: string;
      error?: string;
      text?: string;
      background?: string;
      border?: string;
      disabled?: string;
      hover?: string;
    };
  }
  ```

#### Events

- `close`: Dispatched when the modal is closed

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

    // Optional: Custom theme configuration
    const customTheme = {
        light: {
            primary: '#FF4F7F', // Custom primary color
            success: '#10B981',
            error: '#DC2626',
            text: '#111827',
            background: '#FFFFFF',
            border: '#E5E7EB',
            disabled: '#9CA3AF',
            hover: '#FF3B6F'
        },
        dark: {
            primary: '#FF4F7F', // Custom primary color
            success: '#10B981',
            error: '#DC2626',
            text: '#F9FAFB',
            background: '#1F2937',
            border: '#374151',
            disabled: '#6B7280',
            hover: '#FF3B6F'
        }
    };
</script>

<TransactionModal
    {isOpen}
    {transactions}
    {signer}
    theme="light"
    title="Borrow 1000 USDC"
    subtitle="Variable Rolling Rate"
    positionsUrl="/positions"
    socialLinks={{
        x: 'https://x.com/your-handle',
        warpcast: 'https://warpcast.com/your-handle',
        telegram: 'https://t.me/your-channel'
    }}
    supportChannelUrl="https://t.me/your-support"
    {customTheme}
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

# TransactionModal Component - Svelte 4 Compatibility

## Compatibility
- **Svelte:** ^4.2.7
- **@sveltejs/vite-plugin-svelte:** ^2.4.5
- **Vite:** ^4.0.0

> **Note:** This project is now fully compatible with Svelte 4. If you are migrating from Svelte 5, ensure you downgrade your dependencies as above. Remove any Svelte 5-specific syntax or APIs from your codebase.

## Features
- Live theme customization and preview remain fully functional.
- The preview modal matches the actual modal in width, layout, and spinner appearance.
- All developer tooling and test pages work as before.

## Migration
If you were previously using Svelte 5, update your `package.json` as follows:
- Set `"svelte": "^4.2.7"` in both `devDependencies` and `peerDependencies`.
- Set `"@sveltejs/vite-plugin-svelte": "^2.4.5"`.
- Set `"vite": "^4.0.0"`.
- Run `npm install --legacy-peer-deps` to resolve dependency conflicts.

For more details, see the main README or the test page in the project. 