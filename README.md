# Web3 Transaction Manager

A Svelte package for managing sequential Web3 transactions with a user-friendly interface.

## Features

- Sequential transaction execution
- Real-time transaction status tracking
- Customizable UI themes (light/dark)
- Support for multiple transactions
- Success/failure handling
- Customizable social links
- Help/feedback section
- Block explorer integration
- Responsive design

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
  let signer;
  let address;

  const transactions = [
    {
      id: '1',
      type: 'standard',
      params: {
        to: '0x123...',
        value: '1000000000000000000'
      },
      metadata: {
        title: 'Send ETH',
        description: 'Send 1 ETH'
      }
    }
  ];

  const socialLinks = [
    { label: 'Twitter', url: 'https://twitter.com/your-handle' },
    { label: 'Discord', url: 'https://discord.gg/your-server' }
  ];
</script>

<TransactionModal
  {isOpen}
  {transactions}
  {signer}
  {address}
  theme="light"
  title="Send ETH"
  subtitle="Transfer 1 ETH"
  blockExplorerUrl="https://etherscan.io"
  {socialLinks}
/>
```

## TransactionModal Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `transactions` | `Transaction[]` | Array of transactions to execute |
| `signer` | `ethers.Signer` | Ethers signer instance |
| `address` | `string` | The connected wallet address |
| `blockExplorerUrl` | `string` | Base URL for block explorer (e.g., "https://etherscan.io/tx/") |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `theme` | `'light' \| 'dark'` | `'light'` | UI theme |
| `title` | `string` | `'Borrow 1000 USDC'` | Modal title |
| `subtitle` | `string` | `'Variable Rolling Rate'` | Modal subtitle |
| `redirectUrl` | `string` | `'#'` | URL to redirect after success |
| `socialLinks` | `Array<{label: string, url: string}>` | `[]` | Social media links to display |
| `supportChannelUrl` | `string` | `'https://t.me/your-support'` | Support channel URL |
| `customTheme` | `Partial<ThemeConfig>` | `{}` | Custom theme configuration |
| `closeOnOverlayClick` | `boolean` | `false` | Whether clicking overlay closes modal |
| `successMessage` | `string` | `'Head to the Positions page...'` | Success screen message |
| `redirectMessage` | `string` | `'Positions'` | Text for redirect link |
| `showHelpSection` | `boolean` | `true` | Show help/feedback section |
| `helpMessage` | `string` | `'Need help or have feedback?'` | Help section message |
| `helpRedirectText` | `string` | `'Chat with someone'` | Help section link text |
| `showFinalSuccessScreen` | `boolean` | `true` | Show success screen after completion |

## Theme Configuration

The component supports both light and dark themes, with customizable colors:

```typescript
interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

interface ThemeColors {
  primary: string;
  success: string;
  error: string;
  text: string;
  background: string;
  border: string;
  disabled: string;
  hover: string;
  card: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonDisabled: string;
  buttonDisabledText: string;
  buttonError: string;
  buttonErrorText: string;
  buttonSuccess: string;
  buttonSuccessText: string;
  buttonProcessing: string;
  buttonProcessingText: string;
  buttonHover: string;
}
```

Example theme customization:

```svelte
<TransactionModal
  customTheme={{
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
      buttonHover: '#3B82F6'
    },
    dark: {
      // Dark theme colors...
    }
  }}
/>
```

## Ethers Compatibility

This package is compatible with ethers v5.x. Make sure to use ethers v5 in your project:

```bash
npm install ethers@5.7.2
```

## License

MIT

## Preview Page
[Preview](https://web3-transaction-manager.netlify.app/)

## Running Locally

To run the preview and test the TransactionModal component locally:

```sh
npm install
npm run dev
```

This will start a local development server and open the preview page at the root URL (http://localhost:5173 or similar). The preview page allows you to interactively test and customize the TransactionModal component and theme.

### Multicall Transactions

If you want to batch multiple contract calls into a single transaction (multicall), you must encode the multicall before passing it to the transaction flow. The modal does not need to know it is a multicall; it simply sends the transaction as specified.

**Example:**

```js
// Prepare individual calls
const call1 = contract.interface.encodeFunctionData('doSomething', [arg1, arg2]);
const call2 = contract.interface.encodeFunctionData('doAnotherThing', [arg3]);

// Encode multicall
const multicallData = contract.interface.encodeFunctionData('multicall', [[call1, call2]]);

// Pass to the transaction flow
{
  to: contract.address,
  data: multicallData,
  value: 0
}
```

The modal will submit this as a single transaction. The contract will execute all batched actions.
