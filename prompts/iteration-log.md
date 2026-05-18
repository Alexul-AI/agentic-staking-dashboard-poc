# Iteration Log

## Iteration 1 — Initial Hook Generation

Generated a React hook from a Solidity staking contract.

The hook included:

- reading staked balance
- reading earned rewards
- staking ETH
- withdrawing funds
- claiming rewards
- waiting for transaction confirmation

## Issue 1 — Deprecated wagmi API

The initial generated code used deprecated wagmi patterns.

### Fix

Updated the hook to use current wagmi patterns and replaced deprecated usage.

## Issue 2 — React Hooks ESLint Warning

The generated code called `setState` directly inside an effect.

### Fix

Refactored error handling so transaction receipt errors are derived from existing hook state instead of being set synchronously inside `useEffect`.

## Issue 3 — Missing Hook Dependencies

React Hooks ESLint reported missing dependencies inside `useCallback`.

### Fix

Wrapped transaction helpers in `useCallback` and added the correct dependency arrays.

## Issue 4 — UI Integration

Generated a Tailwind CSS staking dashboard component.

The component includes:

- staking input
- staked balance display
- earned rewards display
- claim rewards action
- withdraw action
- loading spinner
- error display

## Issue 5 — Tailwind CSS Not Applied

The first UI preview appeared broken because Tailwind CSS was not correctly configured.

### Fix

Installed and configured Tailwind CSS for Vite and updated the global CSS entry point.

## Issue 6 — Contract Address

The frontend required a deployed smart contract address.

### Fix

The Solidity staking contract was deployed through Remix IDE to the Ethereum Sepolia testnet.

Deployed contract:

```text
0xbB31245F4842FE90041B378CDac9Fe1c37701067
```

Explorer:

```text
https://sepolia.etherscan.io/address/0xbB31245F4842FE90041B378CDac9Fe1c37701067
```

## Issue 7 — Missing Wallet Connection Flow

The staking dashboard could call the contract hook, but there was no visible wallet connection button.

### Fix

Added a MetaMask connection button using wagmi connection hooks and displayed the connected wallet address in the dashboard.

## Issue 8 — Wallet Connector Conflict

During wallet connection testing, multiple browser wallet extensions competed for the injected provider.

Observed behavior:

- Trust Wallet opened instead of MetaMask.
- Coinbase Wallet opened after Trust Wallet was removed.
- MetaMask was available in the browser, but the connector flow had to be debugged.

### Fix

Removed or disabled competing wallet extensions and configured the app to target MetaMask through the injected wallet connector.

## Issue 9 — MetaMask SDK Connector Import Error

Using the direct MetaMask connector caused a Vite runtime import error related to a missing MetaMask SDK dependency.

### Fix

Replaced the direct MetaMask connector with an injected connector targeting MetaMask.

## Issue 10 — Successful MetaMask Connection

The frontend successfully opened the MetaMask connection request from `localhost:5173`.

Result:

- MetaMask connection popup appeared.
- The wallet was connected to the dashboard.
- The UI displayed the shortened wallet address.

## Issue 11 — Successful End-to-End Stake Flow

The React frontend successfully connected to MetaMask, submitted a stake transaction, waited for confirmation, and updated the on-chain staking balance in the UI.

Verified flow:

```text
React UI
  → wagmi / viem hook
  → MetaMask transaction request
  → Sepolia transaction
  → deployed Solidity contract
  → confirmed transaction
  → updated dashboard state
```

Tested stake amount:

```text
0.001 SepoliaETH
```

Result:

- MetaMask transaction request appeared.
- Transaction was confirmed.
- `Staked ETH` updated to `0.001`.

## Issue 12 — Successful Withdraw Flow

The withdraw flow was tested after staking.

Result:

- `Withdraw All` triggered a MetaMask transaction.
- Staked balance returned to `0.0`.
- Rewards value became visible.
- The dashboard continued reading on-chain state correctly.

## Current Status

The frontend, wallet connection, deployed contract integration, stake flow, and withdraw flow are working on Ethereum Sepolia.

Current deployed contract:

```text
0xbB31245F4842FE90041B378CDac9Fe1c37701067
```

## Next Steps

1. Add Etherscan transaction links to the UI.
2. Improve network mismatch handling.
3. Add reward pool UX for `fundRewards`.
4. Add architecture documentation.
5. Add Solidity security notes.
6. Improve production-readiness of the smart contract.
