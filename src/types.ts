export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Vault = {
  id: 'stable' | 'growth' | 'turbo';
  name: string;
  risk: RiskLevel;
  apy: string;
  tvl: number;
  userBalanceUsd: number;
  pricePerShare: number;
};

export type TxStatus = 'idle' | 'approving' | 'approve-confirmed' | 'depositing' | 'success' | 'failed';

export type Position = {
  vaultId: Vault['id'];
  vaultName: string;
  usdValue: number;
  shares: number;
};

export type TransactionType = 'deposit' | 'withdraw';

export type TransactionHistoryItem = {
  id: string;
  type: TransactionType;
  vaultId: Vault['id'];
  vaultName: string;
  amountUsd: number;
  shares: number;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
  txHash?: string;
  error?: string;
};
