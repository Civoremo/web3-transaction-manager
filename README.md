# Web3 Transaction Manager

A beautiful, user-friendly Svelte component library for managing multi-step blockchain transactions with support for on-chain transactions, HTTP requests, and message signing.

## 🚀 Features

- **Multi-step Transaction Flow** - Execute transactions sequentially with visual progress tracking
- **Multiple Transaction Types** - Support for blockchain transactions, HTTP requests, and message signing
- **Real-time Status Display** - Live updates on transaction progress, success, and failure states
- **Fully Customizable** - Light/dark themes with complete color and typography customization
- **Accessible & Responsive** - Keyboard-friendly, ARIA-compliant, and mobile-responsive
- **Zero Dependencies** - No manual CSS imports required, styles are automatically injected
- **Social Integration** - Built-in support for social links and help channels
- **Error Handling** - Comprehensive error states with retry functionality
- **TypeScript Support** - Full type safety with comprehensive type definitions

## 📦 Installation

```bash
npm install web3-transaction-manager
```

## 🎯 Quick Start

```svelte
<script>
  import { TransactionModal } from 'web3-transaction-manager';
  import { ethers } from 'ethers';
  import { writable } from 'svelte/store';

  let isOpen = false;
  let signer; // Your ethers.js signer
  let address; // User's wallet address

  // Define your transaction flow
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

  // Track transaction statuses
  let transactionStatuses = writable({});

  // Handle transaction execution
  async function handleTxExecute(event) {
    const { transactionId } = event.detail;
    const tx = transactions.find(t => t.id === transactionId);
    
    // Update status to processing
    transactionStatuses.update(statuses => ({
      ...statuses,
      [transactionId]: { status: 'processing' }
    }));

    try {
      // Execute the transaction based on type
      if (tx.type === 'fetch') {
        const response = await fetch(tx.params.url, {
          method: tx.params.method || 'GET',
          headers: tx.params.headers,
          body: tx.params.body ? JSON.stringify(tx.params.body) : undefined
        });
        if (!response.ok) throw new Error('Fetch failed');
      } else if (tx.type === 'signature') {
        await signer.signMessage(tx.params.message);
      } else {
        // Blockchain transaction
        await signer.sendTransaction({
          to: tx.params.to,
          data: tx.params.data,
          value: tx.params.value
        });
      }

      // Update status to success
      transactionStatuses.update(statuses => ({
        ...statuses,
        [transactionId]: { status: 'success' }
      }));
    } catch (error) {
      // Update status to failed
      transactionStatuses.update(statuses => ({
        ...statuses,
        [transactionId]: { status: 'failed', error: error.message }
      }));
    }
  }
</script>

<button on:click={() => isOpen = true}>
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
  socialLinks={[
    { label: 'Twitter', url: 'https://twitter.com/your-handle' },
    { label: 'Discord', url: 'https://discord.gg/your-server' }
  ]}
  supportChannelUrl="https://t.me/your-support"
  on:close={() => isOpen = false}
  on:txExecute={handleTxExecute}
/>
```

## 🔧 How It Works

### Parent Component Responsibilities

The **parent component** is responsible for:
- ✅ Executing transactions (sending to blockchain, making HTTP requests, signing messages)
- ✅ Managing and updating transaction statuses
- ✅ Handling errors and retries
- ✅ Reacting to modal events (close, completion)

### Modal Component Responsibilities

The **modal component** handles:
- ✅ Displaying transaction progress and status
- ✅ Providing user interface for transaction execution
- ✅ Managing visual states (pending, processing, success, failed)
- ✅ Emitting events for parent to handle

### Transaction Flow

1. **User clicks "Start"** → Modal opens with transaction list
2. **User clicks transaction button** → Modal emits `txExecute` event
3. **Parent executes transaction** → Updates status via `transactionStatuses`
4. **Modal reflects status** → Shows success/failure state
5. **Next transaction becomes available** → User can proceed sequentially
6. **All complete** → Success screen with redirect options

## 📋 Supported Transaction Types

### 1. Blockchain Transactions

#### Approval Transactions
```typescript
{
  id: 'approve-usdc',
  type: 'approval',
  params: {
    to: '0xTokenContractAddress',
    data: '0xEncodedApproveFunctionData'
  },
  metadata: {
    title: 'Approve USDC',
    buttonLabel: 'Approve'
  }
}
```

#### Contract Interactions
```typescript
{
  id: 'borrow-usdc',
  type: 'contract',
  params: {
    to: '0xLendingContractAddress',
    data: '0xEncodedBorrowFunctionData',
    value: '0' // Optional ETH value
  },
  metadata: {
    title: 'Borrow 1000 USDC',
    buttonLabel: 'Borrow'
  }
}
```

#### Standard Transfers
```typescript
{
  id: 'send-eth',
  type: 'standard',
  params: {
    to: '0xRecipientAddress',
    value: '1000000000000000000' // 1 ETH in wei
  },
  metadata: {
    title: 'Send 1 ETH',
    buttonLabel: 'Send'
  }
}
```

### 2. HTTP Requests (Fetch)

```typescript
{
  id: 'notify-backend',
  type: 'fetch',
  params: {
    url: 'https://api.example.com/notify',
    method: 'POST',
    body: {
      userAddress: '0x...',
      action: 'deposit',
      amount: '1000'
    },
    headers: {
      'Authorization': 'Bearer your-token',
      'Content-Type': 'application/json'
    }
  },
  metadata: {
    title: 'Notify Backend',
    buttonLabel: 'Notify'
  }
}
```

### 3. Message Signing

#### Personal Signatures
```typescript
{
  id: 'sign-agreement',
  type: 'signature',
  params: {
    message: 'I agree to the terms and conditions for this transaction.',
    signatureType: 'personal'
  },
  metadata: {
    title: 'Sign Agreement',
    buttonLabel: 'Sign'
  }
}
```

#### EIP-712 Typed Signatures
```typescript
{
  id: 'sign-typed-data',
  type: 'signature',
  params: {
    message: {
      types: { Person: [{ name: 'name', type: 'string' }] },
      value: { name: 'Alice' }
    },
    domain: {
      name: 'Test Domain',
      version: '1',
      chainId: 1,
      verifyingContract: '0x...'
    },
    signatureType: 'typed'
  },
  metadata: {
    title: 'Sign Typed Data',
    buttonLabel: 'Sign'
  }
}
```

## 🎨 Theming & Customization

### Basic Theme Selection

```svelte
<TransactionModal
  theme="light" // or "dark"
  // ... other props
/>
```

### Advanced Theme Customization

```svelte
<TransactionModal
  customTheme={{
    light: {
      // Colors
      primary: '#4F7FFF',
      success: '#10B981',
      error: '#DC2626',
      text: '#111827',
      background: '#FFFFFF',
      border: '#E5E7EB',
      
      // Typography
      fontFamily: 'Inter, sans-serif',
      titleFontSize: '24px',
      titleColor: '#111827',
      subtitleFontSize: '16px',
      subtitleColor: '#6B7280',
      
      // Buttons
      buttonPrimary: '#4F7FFF',
      buttonPrimaryText: '#FFFFFF',
      buttonHover: '#3B82F6',
      buttonDisabled: 'rgba(79,127,255,0.1)',
      buttonDisabledText: '#4F7FFF',
      buttonError: '#DC2626',
      buttonErrorText: '#FFFFFF',
      buttonSuccess: '#FFFFFF',
      buttonSuccessText: '#64748B',
      buttonProcessing: '#4F7FFF',
      buttonProcessingText: '#FFFFFF',
      
      // Layout
      card: '#F7F7FA',
      modalBackground: 'rgba(62,124,255,0.3)',
      primaryActionButtonBackground: '#2B51E8',
      primarySuccessButtonBackground: '#FFFFFF',
      disabledButtonBackground: '#BDC9F8'
    },
    dark: {
      // Dark theme overrides
      primary: '#6C8CFF',
      text: '#FFFFFF',
      background: '#1F2937',
      // ... other dark theme colors
    }
  }}
/>
```

## 📖 API Reference

### Props

#### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `transactions` | `Transaction[]` | Array of transactions to display |
| `signer` | `ethers.Signer` | Ethers.js signer instance |
| `address` | `string` | User's wallet address |

#### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `theme` | `'light' \| 'dark'` | `'light'` | UI theme |
| `successTitle` | `string` | `'Borrow'` | Title prefix for success message (e.g., "Deposit Successful!") |
| `title` | `string` | - | Modal title |
| `subtitle` | `string` | - | Modal subtitle |
| `redirectUrl` | `string` | `'#'` | URL for redirect after success |
| `socialLinks` | `Array<{label, url}>` | `[]` | Social media links |
| `supportChannelUrl` | `string` | - | Support channel URL |
| `customTheme` | `Partial<ThemeConfig>` | `{}` | Custom theme configuration |
| `transactionStatuses` | `Array<{id, status}>` | - | Status for each transaction |
| `closeOnOverlayClick` | `boolean` | `false` | Whether clicking overlay closes modal |
| `successMessage` | `string` | - | Success screen message |
| `redirectMessage` | `string` | - | Text for redirect link in success message |
| `showHelpSection` | `boolean` | `true` | Show help/feedback section |
| `helpMessage` | `string` | - | Help section message |
| `helpRedirectText` | `string` | - | Help section link text |
| `showFinalSuccessScreen` | `boolean` | `true` | Show success screen after completion |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | - | Dispatched when modal is closed |
| `txExecute` | `{ transactionId: string }` | Dispatched when user clicks to execute a transaction |

### Types

```typescript
type TransactionType = 'approval' | 'contract' | 'standard' | 'fetch' | 'signature';

interface Transaction {
  id: string;
  type: TransactionType;
  params: {
    // Blockchain transaction parameters
    to?: string;
    data?: string;
    value?: string;
    gasLimit?: string;
    gasPrice?: string;
    
    // Fetch request parameters
    url?: string;
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    
    // Signature parameters
    message?: string | { types: any; value: any };
    domain?: unknown;
    signatureType?: 'personal' | 'typed';
  };
  metadata: {
    title: string;
    buttonLabel: string;
    description?: string;
  };
}

type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
```

## 🔄 Advanced Usage Examples

### Mixed Transaction Flow

```typescript
const transactions = [
  // 1. Fetch user data
  {
    id: 'fetch-user-data',
    type: 'fetch',
    params: {
      url: 'https://api.example.com/user/0x123...',
      method: 'GET'
    },
    metadata: {
      title: 'Fetch User Data',
      buttonLabel: 'Fetch'
    }
  },
  
  // 2. Sign agreement
  {
    id: 'sign-agreement',
    type: 'signature',
    params: {
      message: 'I agree to the lending terms and conditions.',
      signatureType: 'personal'
    },
    metadata: {
      title: 'Sign Agreement',
      buttonLabel: 'Sign'
    }
  },
  
  // 3. Approve token
  {
    id: 'approve-usdc',
    type: 'approval',
    params: {
      to: '0xUSDCContract',
      data: '0xEncodedApproveData'
    },
    metadata: {
      title: 'Approve USDC',
      buttonLabel: 'Approve'
    }
  },
  
  // 4. Execute loan
  {
    id: 'borrow-usdc',
    type: 'contract',
    params: {
      to: '0xLendingContract',
      data: '0xEncodedBorrowData'
    },
    metadata: {
      title: 'Borrow 1000 USDC',
      buttonLabel: 'Borrow'
    }
  },
  
  // 5. Notify backend
  {
    id: 'notify-backend',
    type: 'fetch',
    params: {
      url: 'https://api.example.com/loan-completed',
      method: 'POST',
      body: {
        userAddress: '0x123...',
        loanAmount: '1000',
        timestamp: Date.now()
      }
    },
    metadata: {
      title: 'Notify Backend',
      buttonLabel: 'Notify'
    }
  }
];
```

### Multicall Transactions

For batching multiple contract calls into a single transaction:

```typescript
// Prepare individual calls
const call1 = contract.interface.encodeFunctionData('doSomething', [arg1, arg2]);
const call2 = contract.interface.encodeFunctionData('doAnotherThing', [arg3]);

// Encode multicall
const multicallData = contract.interface.encodeFunctionData('multicall', [[call1, call2]]);

// Pass to transaction flow
{
  id: 'multicall',
  type: 'contract',
  params: {
    to: contract.address,
    data: multicallData,
    value: '0'
  },
  metadata: {
    title: 'Execute Multiple Actions',
    buttonLabel: 'Execute'
  }
}
```

## 🧪 Testing & Development

### Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the interactive test page with theme customization.

### Preview

Check out the live preview: [https://web3-transaction-manager.netlify.app/](https://web3-transaction-manager.netlify.app/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
