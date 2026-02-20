# TM Vault Mobile (Expo)

A React Native (Expo) mobile app scaffold for Token Metrics vault investors.

## Implemented scope

- Wallet connection UX with persisted session (`AsyncStorage`) and USDC balance load.
- Wrong-network detection and HyperEVM switch prompt.
- Vault cards (Stable, Growth, Turbo) showing APY, risk, user balance, and TVL.
- Approve → Deposit flow with explicit transaction states:
  - `approving`
  - `approve-confirmed`
  - `depositing`
  - `success`
  - `failed`
- Haptic feedback on critical state transitions.
- Success confetti animation on completed deposits.
- Structured error handling for common web3 outcomes:
  - user rejection
  - transaction revert
  - insufficient funds
  - wrong network
- Portfolio summary with aggregate USD value and per-vault breakdown.
- Pull-to-refresh wallet state.
- Recent transaction history card.

> Note: The chain and wallet service layer currently uses mock adapters in `src/services/blockchain.ts` so UI and async handling can be validated in simulator quickly. Swap these functions to real Privy/WalletConnect + contract calls for production.

## Mock failure triggers (for deterministic QA)

To force failure paths in the mock deposit call, use these amount endings:

- Amount ending in `.01` cents ⇒ user rejected
- Amount ending in `.02` cents ⇒ tx reverted

## Environment variables

Create a local env file before running:

```bash
cp .env.example .env
```

Supported variables:

- `EXPO_PUBLIC_APP_NAME` - app header title
- `EXPO_PUBLIC_HYPER_EVM_CHAIN_ID` - expected chain id for network checks
- `EXPO_PUBLIC_DEMO_WALLET` - seeded demo wallet used by the mock connector

## Run

```bash
npm install
npm run start
```

Then run on iOS simulator from Expo.

## Suggested production wiring

- Replace `useWallet` demo connector with Privy RN SDK or WalletConnect provider.
- Replace `approveUsdc` and `depositToVault` mocks with ethers.js contract calls.
- Add withdraw flow with pending lock/unlock states.
