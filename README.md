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
      modalBackground: '#FAFAFB',
      modalBorderColor: '#FAFAFB',
      modalBackdropBlur: 5,
      primaryActionButtonBackground: '#2B51E8',
      primarySuccessButtonBackground: '#FFFFFF',
      disabledButtonBackground: '#BDC9F8',
      
      // Social Links
      socialLinkFontSize: '15px',
      socialLinkColor: '#000000',
      socialLinkButtonBackground: '#FFFFFF',
      socialLinkHoverBackground: '#F8FAFC',
      socialLinkHoverBorderColor: '#CBD5E1',
      socialLinkHoverTextColor: '#000000',
      
      // Success Messages
      successMessageFontSize: '18px',
      successMessageColor: '#555F81',
      successRedirectColor: '#2e54e8',
      successRedirectHoverColor: '#2e54e8',
      
      // Help Section
      helpTextFontSize: '12px',
      helpTextColor: '#555F81',
      helpRedirectFontSize: '12px',
      helpRedirectColor: '#555F81',
      helpRedirectHoverColor: '#555F81'
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

### Theme Examples

#### Custom Brand Colors
```svelte
<TransactionModal
  customTheme={{
    light: {
      primary: '#FF6B6B',
      success: '#51CF66',
      error: '#FF6B6B',
      modalBackground: '#FFFFFF',
      modalBorderColor: '#E9ECEF',
      modalBackdropBlur: 10
    }
  }}
/>
```

#### High Contrast Theme
```svelte
<TransactionModal
  customTheme={{
    light: {
      text: '#000000',
      background: '#FFFFFF',
      border: '#000000',
      modalBackground: '#FFFFFF',
      modalBorderColor: '#000000',
      modalBackdropBlur: 15
    }
  }}
/>
```

#### Minimal Blur Theme
```svelte
<TransactionModal
  customTheme={{
    light: {
      modalBackdropBlur: 2, // Very subtle blur
      modalBorderColor: '#E5E7EB'
    },
    dark: {
      modalBackdropBlur: 1, // Almost no blur
      modalBorderColor: '#374151'
    }
  }}
/>
```

#### Custom Social Links
```svelte
<TransactionModal
  customTheme={{
    light: {
      socialLinkColor: '#1E40AF',
      socialLinkButtonBackground: '#EFF6FF',
      socialLinkHoverBackground: '#DBEAFE',
      socialLinkHoverBorderColor: '#3B82F6',
      socialLinkHoverTextColor: '#1E40AF'
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

### Theme Properties

#### Color Properties

| Property | Type | Description | Default (Light) | Default (Dark) |
|----------|------|-------------|-----------------|----------------|
| `primary` | `string` | Primary brand color | `#4F7FFF` | `#4F7FFF` |
| `success` | `string` | Success state color | `#10B981` | `#10B981` |
| `error` | `string` | Error state color | `#DC2626` | `#DC2626` |
| `text` | `string` | Primary text color | `#111827` | `#F9FAFB` |
| `background` | `string` | Background color | `#FFFFFF` | `#1F2937` |
| `border` | `string` | Border color | `#E5E7EB` | `#374151` |
| `disabled` | `string` | Disabled state color | `#9CA3AF` | `#6B7280` |
| `hover` | `string` | Hover state color | `#3B82F6` | `#3B82F6` |
| `card` | `string` | Card background color | `#EEEFFA` | `#EEEFFA` |

#### Button Colors

| Property | Type | Description | Default (Light) | Default (Dark) |
|----------|------|-------------|-----------------|----------------|
| `buttonPrimary` | `string` | Primary button background | `#4F7FFF` | `#4F7FFF` |
| `buttonPrimaryText` | `string` | Primary button text | `#FFFFFF` | `#FFFFFF` |
| `buttonHover` | `string` | Button hover state | `#3B66E5` | `#3B66E5` |
| `buttonDisabled` | `string` | Disabled button background | `rgba(79,127,255,0.1)` | `rgba(79,127,255,0.1)` |
| `buttonDisabledText` | `string` | Disabled button text | `#FFFFFF` | `#FFFFFF` |
| `buttonError` | `string` | Error button background | `#DC2626` | `#DC2626` |
| `buttonErrorText` | `string` | Error button text | `#FFFFFF` | `#FFFFFF` |
| `buttonSuccess` | `string` | Success button background | `#FFFFFF` | `#1F2937` |
| `buttonSuccessText` | `string` | Success button text | `#64748B` | `#9CA3AF` |
| `buttonProcessing` | `string` | Processing button background | `#4F7FFF` | `#4F7FFF` |
| `buttonProcessingText` | `string` | Processing button text | `#FFFFFF` | `#FFFFFF` |

#### Modal Properties

| Property | Type | Description | Default (Light) | Default (Dark) |
|----------|------|-------------|-----------------|----------------|
| `modalBackground` | `string` | Modal background color | `#FAFAFB` | `#181A20` |
| `modalBorderColor` | `string` | Modal border color | `#FAFAFB` | `#181A20` |
| `modalBackdropBlur` | `number` | Background blur intensity (1-100) | `5` | `5` |
| `primaryActionButtonBackground` | `string` | Primary action button background | `#2B51E8` | `#6C8CFF` |
| `primarySuccessButtonBackground` | `string` | Success button background | `#FFFFFF` | `#232946` |
| `disabledButtonBackground` | `string` | Disabled button background | `#BDC9F8` | `#3A4668` |

#### Typography Properties

| Property | Type | Description | Default (Light) | Default (Dark) |
|----------|------|-------------|-----------------|----------------|
| `fontFamily` | `string` | Font family | `inherit` | `inherit` |
| `titleFontSize` | `string` | Title font size | `24px` | `24px` |
| `titleColor` | `string` | Title text color | `#000000` | `#FFFFFF` |
| `subtitleFontSize` | `string` | Subtitle font size | `18px` | `18px` |
| `subtitleColor` | `string` | Subtitle text color | `#555F81` | `#AAB8D1` |
| `metadataTitleFontSize` | `string` | Transaction title font size | `15px` | `15px` |
| `metadataTitleColor` | `string` | Transaction title color | `#000000` | `#FFFFFF` |
| `metadataButtonLabelFontSize` | `string` | Button label font size | `14px` | `14px` |
| `metadataButtonLabelColor` | `string` | Button label color | `#FFFFFF` | `#FFFFFF` |
| `metadataButtonLabelSuccessColor` | `string` | Success button label color | `#000000` | `#2B51E8` |

#### Social Link Properties

| Property | Type | Description | Default (Light) | Default (Dark) |
|----------|------|-------------|-----------------|----------------|
| `socialLinkFontSize` | `string` | Social link font size | `15px` | `15px` |
| `socialLinkColor` | `string` | Social link text color | `#000000` | `#FFFFFF` |
| `socialLinkButtonBackground` | `string` | Social link button background | `#FFFFFF` | `#232946` |
| `socialLinkHoverBackground` | `string` | Social link hover background | `#F8FAFC` | `#374151` |
| `socialLinkHoverBorderColor` | `string` | Social link hover border | `#CBD5E1` | `#4B5563` |
| `socialLinkHoverTextColor` | `string` | Social link hover text | `#000000` | `#FFFFFF` |

#### Success Message Properties

| Property | Type | Description | Default (Light) | Default (Dark) |
|----------|------|-------------|-----------------|----------------|
| `successMessageFontSize` | `string` | Success message font size | `18px` | `18px` |
| `successMessageColor` | `string` | Success message text color | `#555F81` | `#AAB8D1` |
| `successRedirectColor` | `string` | Success redirect link color | `#2e54e8` | `#6C8CFF` |
| `successRedirectHoverColor` | `string` | Success redirect hover color | `#2e54e8` | `#AAB8D1` |

#### Help Section Properties

| Property | Type | Description | Default (Light) | Default (Dark) |
|----------|------|-------------|-----------------|----------------|
| `helpTextFontSize` | `string` | Help text font size | `12px` | `12px` |
| `helpTextColor` | `string` | Help text color | `#555F81` | `#AAB8D1` |
| `helpRedirectFontSize` | `string` | Help redirect font size | `12px` | `12px` |
| `helpRedirectColor` | `string` | Help redirect color | `#555F81` | `#AAB8D1` |
| `helpRedirectHoverColor` | `string` | Help redirect hover color | `#555F81` | `#AAB8D1` |

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
