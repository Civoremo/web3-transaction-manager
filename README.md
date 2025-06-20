# Web3 Transaction Manager

A Svelte component library for managing multi-step blockchain transactions with a beautiful, user-friendly interface.  
**Note:** This modal is a UI-only component. The parent is responsible for executing transactions and managing their statuses.

---

## Features

- Multi-step, sequential transaction flow
- Real-time transaction status display
- Fully themeable (light/dark/custom themes)
- Social and support links
- Success/failure handling and summary
- Responsive, accessible, and keyboard-friendly
- No manual CSS import required—styles are injected automatically

---

## Installation

```bash
npm install web3-transaction-manager
```

---

## Parent Responsibility & Status Flow

- **The parent component is responsible for:**
  - Executing transactions (sending them to the blockchain)
  - Managing and updating transaction statuses
  - Handling errors and retries
  - Reacting to modal events (e.g., close, completion)

- **The modal:**
  - Receives transactions and their statuses as props
  - Displays progress, results, and summary
  - Emits events for the parent to handle

---

## Usage Example

```svelte
<script>
  import { TransactionModal } from 'web3-transaction-manager';
  import { ethers } from 'ethers';
  import { writable } from 'svelte/store';

  let isOpen = false;
  let signer; // Your ethers.js signer
  let address; // User's wallet address

  // Define your transactions
  const transactions = [
    {
      id: 'approve',
      type: 'approval',
      params: {
        to: '0xTokenAddress...',
        data: '0xEncodedData...'
      },
      metadata: {
        title: 'Approve USDC',
        buttonLabel: 'Approve'
      }
    },
    {
      id: 'borrow',
      type: 'contract',
      params: {
        to: '0xContractAddress...',
        data: '0xEncodedData...'
      },
      metadata: {
        title: 'Borrow 1000 USDC',
        buttonLabel: 'Borrow'
      }
    }
  ];

  // Track transaction statuses in a Svelte store
  let transactionStatuses = writable([
    { id: 'approve', status: 'pending' },
    { id: 'borrow', status: 'pending' }
  ]);

  // Example: Parent executes transactions and updates statuses
  async function executeTransactions() {
    for (const tx of transactions) {
      transactionStatuses.update(arr => arr.map(t => t.id === tx.id ? { ...t, status: 'processing' } : t));
      try {
        // Example: send transaction using ethers.js
        // await signer.sendTransaction({ to: tx.params.to, data: tx.params.data });
        transactionStatuses.update(arr => arr.map(t => t.id === tx.id ? { ...t, status: 'success' } : t));
      } catch (e) {
        transactionStatuses.update(arr => arr.map(t => t.id === tx.id ? { ...t, status: 'failed' } : t));
      }
    }
  }
</script>

<button on:click={() => { isOpen = true; executeTransactions(); }}>
  Start Transaction Flow
</button>

<TransactionModal
  {isOpen}
  {transactions}
  {signer}
  {address}
  transactionStatuses={$transactionStatuses}
  theme="light"
  title="Borrow 1000 USDC"
  subtitle="Variable Rolling Rate"
  redirectUrl="/positions"
  socialLinks=[
    { label: 'Twitter', url: 'https://twitter.com/your-handle' },
    { label: 'Discord', url: 'https://discord.gg/your-server' }
  ]
  supportChannelUrl="https://t.me/your-support"
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
    }
    // Add dark theme if needed
  }}
  on:close={() => isOpen = false}
/>
```

---

## Props

### Required

| Prop              | Type                | Description                                 |
|-------------------|---------------------|---------------------------------------------|
| `transactions`    | `Transaction[]`     | Array of transactions to display            |
| `signer`          | `ethers.Signer`     | Ethers.js signer instance                   |
| `address`         | `string`            | User's wallet address                       |

### Optional

| Prop                   | Type                        | Default         | Description                                      |
|------------------------|-----------------------------|-----------------|--------------------------------------------------|
| `isOpen`               | `boolean`                   | `false`         | Controls modal visibility                        |
| `theme`                | `'light' \| 'dark'`         | `'light'`       | UI theme                                         |
| `title`                | `string`                    |                 | Modal title                                      |
| `subtitle`             | `string`                    |                 | Modal subtitle                                   |
| `redirectUrl`          | `string`                    | `'#'`           | URL for redirect after success                   |
| `socialLinks`          | `Array<{label, url}>`       | `[]`            | Social media links                               |
| `supportChannelUrl`    | `string`                    |                 | Support channel URL                              |
| `customTheme`          | `Partial<ThemeConfig>`      | `{}`            | Custom theme configuration                       |
| `transactionStatuses`  | `Array<{id, status}>`       |                 | Status for each transaction                      |
| `closeOnOverlayClick`  | `boolean`                   | `false`         | Whether clicking overlay closes modal            |
| `successMessage`       | `string`                    |                 | Success screen message                           |
| `redirectMessage`      | `string`                    |                 | Text for redirect link in success message        |
| `showHelpSection`      | `boolean`                   | `true`          | Show help/feedback section                       |
| `helpMessage`          | `string`                    |                 | Help section message                             |
| `helpRedirectText`     | `string`                    |                 | Help section link text                           |
| `showFinalSuccessScreen`| `boolean`                  | `true`          | Show success screen after completion             |

---

## Events

| Event   | Description                                 |
|---------|---------------------------------------------|
| `close` | Dispatched when the modal is closed         |
| ...     | (Add any other events your modal emits)     |

---

## Transaction & Status Types

```typescript
interface Transaction {
  id: string;
  type: 'approval' | 'contract' | 'standard';
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

type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed';
```

---

## Theming

- All modal and button styles are fully themeable via the `customTheme` prop.
- All theme variables are set as CSS variables and scoped to `.web3-tx-modal`.
- No manual CSS import is needed; styles are injected automatically.

### Example Theme

```js
customTheme={{
  light: {
    primary: '#4F7FFF',
    // ...see full example above
  },
  dark: {
    // ...your dark theme colors
  }
}}
```

---

## Accessibility & UX

- Modal is fully accessible and keyboard-friendly.
- ARIA attributes are set for modal and overlay.
- Pointer cursor only appears on interactive elements (active buttons, links, close button, etc.).
- Modal overlay does not use `role="button"`.

---

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

---

## License

MIT

## Theme Customization

You can now customize font sizes, font family, and text colors for all modal elements via the `customTheme` prop. All values are optional and will fall back to sensible defaults.

### Customizable Theme Variables

| Variable                          | Default (Light)      | Default (Dark)      | Description                                 |
|------------------------------------|----------------------|---------------------|---------------------------------------------|
| fontFamily                        | inherit              | inherit             | Font family for all modal text              |
| titleFontSize                     | 24px                 | 24px                | Modal title font size                       |
| titleColor                        | #000000              | #FFFFFF             | Modal title color                           |
| subtitleFontSize                  | 18px                 | 18px                | Modal subtitle font size                    |
| subtitleColor                     | #555F81              | #AAB8D1             | Modal subtitle color                        |
| metadataTitleFontSize             | 15px                 | 15px                | Metadata title font size                    |
| metadataTitleColor                | #000000              | #FFFFFF             | Metadata title color                        |
| metadataButtonLabelFontSize       | 14px                 | 14px                | Button label font size                      |
| metadataButtonLabelColor          | #FFFFFF              | #FFFFFF             | Button label color (default)                |
| metadataButtonLabelSuccessColor   | #000000              | #2B51E8             | Button label color (success)                |
| helpTextFontSize                  | 12px                 | 12px                | Help/need help text font size               |
| helpTextColor                     | #555F81              | #AAB8D1             | Help/need help text color                   |
| helpRedirectFontSize              | 12px                 | 12px                | Help redirect link font size                |
| helpRedirectColor                 | #555F81              | #AAB8D1             | Help redirect link color                    |
| helpRedirectHoverColor            | #2e54e8              | #6C8CFF             | Help redirect link hover color              |
| socialLinkFontSize                | 15px                 | 15px                | Social link text font size                  |
| socialLinkColor                   | #000000              | #FFFFFF             | Social link text color                      |
| socialLinkButtonBackground        | #FFFFFF              | #232946             | Social link button background color         |
| successMessageFontSize            | 18px                 | 18px                | Success message font size                   |
| successMessageColor               | #555F81              | #AAB8D1             | Success message text color                  |
| successRedirectColor              | #2e54e8              | #6C8CFF             | Success redirect link color                 |
| successRedirectHoverColor         | #2e54e8              | #AAB8D1             | Success redirect link hover color           |
| modalBackground                   | rgba(62,124,255,0.3) | rgba(43,81,232,0.3) | Modal background color                      |
| primaryActionButtonBackground     | #2B51E8              | #6C8CFF             | Primary action button background            |
| primarySuccessButtonBackground    | #FFFFFF              | #232946             | Success button background                   |
| disabledButtonBackground          | #BDC9F8              | #3A4668             | Disabled button background                  |

### Example: Overriding Theme

```svelte
<TransactionModal
  customTheme={{
    light: {
      fontFamily: 'Inter, sans-serif',
      titleFontSize: '28px',
      titleColor: '#222222',
      subtitleFontSize: '20px',
      subtitleColor: '#888888',
      // ...override any other variables as needed
    },
    dark: {
      // ...dark theme overrides
    }
  }}
/>
```

## Mixed Transaction Flows: Contract and Fetch Steps

You can now include both on-chain (contract/approval) and off-chain (fetch/REST/database) steps in your transaction flow. This allows you to mix web3 contract calls with backend/database requests, all with status tracking and retry support.

### Supported Transaction Types

- `approval`: ERC20 approve or similar contract call
- `contract`: Any smart contract call
- `fetch`: Off-chain HTTP(S) request (e.g., REST API, database)
- `standard`: ETH transfer or other simple transaction

### Transaction Interface

```typescript
export type TransactionType = 'approval' | 'contract' | 'fetch' | 'standard';

export interface Transaction {
  id: string;
  type: TransactionType;
  params: {
    // For contract/approval
    to?: string;
    data?: string;
    value?: string;
    // For fetch
    url?: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  };
  metadata: {
    title: string;
    buttonLabel: string;
    description?: string;
  };
}
```

### Example: Mixed Transaction Flow

```js
const transactions = [
  {
    id: 'approve',
    type: 'approval',
    params: { /* ... */ },
    metadata: { title: 'Approve', buttonLabel: 'Approve' }
  },
  {
    id: 'deposit',
    type: 'contract',
    params: { /* ... */ },
    metadata: { title: 'Deposit', buttonLabel: 'Deposit' }
  },
  {
    id: 'notifyBE',
    type: 'fetch',
    params: {
      url: 'https://api.example.com/notify',
      method: 'POST',
      body: { user: '0x...', action: 'deposit' }
    },
    metadata: { title: 'Notify Backend', buttonLabel: 'Notify' }
  },
  {
    id: 'borrow',
    type: 'contract',
    params: { /* ... */ },
    metadata: { title: 'Borrow', buttonLabel: 'Borrow' }
  }
];
```

In your parent execution logic, check the `type` and execute accordingly (see previous instructions for code sample).
