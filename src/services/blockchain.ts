import { Position, Vault } from '../types';

export type DepositErrorCode = 'USER_REJECTED' | 'TX_REVERTED' | 'INSUFFICIENT_FUNDS' | 'WRONG_NETWORK';

export class DepositError extends Error {
  code: DepositErrorCode;

  constructor(code: DepositErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export const HYPER_EVM_CHAIN_ID = 998;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const vaults: Vault[] = [
  { id: 'stable', name: 'Stable Vault', risk: 'Low', apy: '8% - 12%', tvl: 2900000, userBalanceUsd: 0, pricePerShare: 1.02 },
  { id: 'growth', name: 'Growth Vault', risk: 'Medium', apy: '14% - 22%', tvl: 5100000, userBalanceUsd: 0, pricePerShare: 1.08 },
  { id: 'turbo', name: 'Turbo Vault', risk: 'High', apy: '25% - 45%', tvl: 1800000, userBalanceUsd: 0, pricePerShare: 1.24 }
];

export const fetchUsdcBalance = async (_wallet: string) => {
  await sleep(400);
  return 1234.56;
};

export const detectChain = async () => {
  await sleep(150);
  return HYPER_EVM_CHAIN_ID;
};

export const switchNetwork = async () => {
  await sleep(350);
  return true;
};

export const approveUsdc = async (amount: number, availableBalance: number) => {
  await sleep(1000);
  if (amount > availableBalance) {
    throw new DepositError('INSUFFICIENT_FUNDS', 'Insufficient USDC for approval.');
  }
};

const shouldFailDeterministically = (amount: number) => {
  const cents = Math.round(amount * 100) % 10;
  if (cents === 1) return new DepositError('USER_REJECTED', 'Transaction was rejected in wallet.');
  if (cents === 2) return new DepositError('TX_REVERTED', 'Transaction reverted by contract.');
  return null;
};

export const depositToVault = async (amount: number, vault: Vault) => {
  await sleep(1200);
  const deterministicFailure = shouldFailDeterministically(amount);
  if (deterministicFailure) throw deterministicFailure;

  const shares = amount / vault.pricePerShare;
  return { txHash: `0xmocked_${vault.id}_${Date.now()}`, shares };
};

export const computePositions = (items: Vault[]): Position[] =>
  items
    .filter((v) => v.userBalanceUsd > 0)
    .map((v) => ({
      vaultId: v.id,
      vaultName: v.name,
      usdValue: v.userBalanceUsd,
      shares: v.userBalanceUsd / v.pricePerShare
    }));
