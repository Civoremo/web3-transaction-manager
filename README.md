# Web3 Transaction Manager

A modern, user-friendly transaction management system for Web3 applications, built with Svelte. This package provides a seamless interface for managing sequential Web3 transactions with a polished UI and robust state management.

## Features

- 🔄 **Sequential Transaction Flow**
  - Manage multiple transactions in sequence
  - Auto-execute support after approvals
  - Transaction status tracking with external links

- 💅 **Polished UI Components**
  - Modern, clean design
  - Dynamic button states
  - Success/Error handling
  - Loading states and animations
  - Dark theme support

- 🛠 **Developer Experience**
  - TypeScript support
  - Simple integration
  - Minimal boilerplate
  - Comprehensive event system

## Installation

```bash
npm install web3-transaction-manager
# or
yarn add web3-transaction-manager
# or
pnpm add web3-transaction-manager
```

## Usage

### 1. Encode your transactions
```typescript
const approveData = tokenContract.interface.encodeFunctionData('approve', [marketAddress, ethers.MaxUint256]);
const setCreditMarketData = marketContract.interface.encodeFunctionData('setCreditMarket', [/* params */]);

const transactions = [
  {
    id: 'tx1',
    type: 'approval',
    params: { 
      to: tokenAddress, 
      data: approveData, 
      value: '0' 
    },
    metadata: { 
      title: 'Approve USDC', 
      buttonLabel: 'Approve', 
      description: 'Approve USDC for protocol interaction' 
    }
  },
  {
    id: 'tx2',
    type: 'contract',
    params: { 
      to: marketAddress, 
      data: setCreditMarketData, 
      value: '0' 
    },
    metadata: { 
      title: 'Create Credit Position', 
      buttonLabel: 'Create', 
      description: 'Create your credit position' 
    }
  }
];
```

### 2. Use the TransactionModal component
```svelte
<script>
  import { TransactionModal } from 'web3-transaction-manager';
  import { ethers } from 'ethers';

  let isModalOpen = false;
  let signer: ethers.Signer;
  
  function handleSuccess(event) {
    console.log('Transaction success:', event.detail);
  }
  
  function handleError(event) {
    console.error('Transaction error:', event.detail);
  }
</script>

<TransactionModal
  isOpen={isModalOpen}
  transactions={transactions}
  signer={signer}
  theme="light"
  positionsUrl="/positions"
  etherscanBaseUrl="https://etherscan.io/tx/"
  on:close={() => isModalOpen = false}
  on:success={handleSuccess}
  on:error={handleError}
/>
```

## Component Props

### TransactionModal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | false | Controls modal visibility |
| transactions | Transaction[] | [] | Array of transactions to process |
| signer | ethers.Signer | - | Ethers.js signer instance |
| theme | 'light' \| 'dark' | 'light' | UI theme |
| positionsUrl | string | '#' | URL for positions page link |
| etherscanBaseUrl | string | 'https://etherscan.io/tx/' | Base URL for transaction links |
| title | string | - | Modal title |
| subtitle | string | - | Modal subtitle |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| close | - | Modal closed |
| success | { transactionId: string, hash: string } | Transaction succeeded |
| error | { transactionId: string, error: string } | Transaction failed |

## Styling

The package includes a modern, polished design system with support for both light and dark themes:

### Button States
```css
/* Active button (blue) */
background: #4F7FFF;
color: white;

/* Processing button (blue with arrow) */
background: #4F7FFF;
color: white;

/* Success button (white with arrow) */
background: white;
color: #64748B;
border: 1px solid #E2E8F0;

/* Disabled button (light blue) */
background: rgba(79, 127, 255, 0.1);
color: #4F7FFF;
```

### Dark Theme Support
```css
/* Dark theme variations */
.dark .modal-content {
    background: #1F2937;
}

.dark .action-button.success {
    background: #1F2937;
    border-color: #374151;
    color: #9CA3AF;
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start preview page
npm run test:page

# Run tests
npm run test

# Build for production
npm run build
```

## License

MIT

