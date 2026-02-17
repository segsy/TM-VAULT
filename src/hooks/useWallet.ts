import { useCallback, useEffect, useMemo, useState } from 'react';
import { detectChain, fetchUsdcBalance, HYPER_EVM_CHAIN_ID, switchNetwork } from '../services/blockchain';
import { usePersistedState } from './usePersistedState';

const DEMO_WALLET = process.env.EXPO_PUBLIC_DEMO_WALLET || '0xA16f2D52B4cB267D4A79fbef2F6f47dF212AABcd';

export const useWallet = () => {
  const persisted = usePersistedState<{ address: string | null }>('wallet', { address: null });
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const connected = useMemo(() => Boolean(persisted.value.address), [persisted.value.address]);

  const refreshWalletState = useCallback(async () => {
    if (!persisted.value.address) return;

    const [balance, chainId] = await Promise.all([fetchUsdcBalance(persisted.value.address), detectChain()]);
    setUsdcBalance(balance);

    if (chainId !== HYPER_EVM_CHAIN_ID) {
      setNetworkError('Wrong network. Please switch to HyperEVM testnet.');
      return;
    }

    setNetworkError(null);
  }, [persisted.value.address]);

  useEffect(() => {
    if (!persisted.hydrated || !persisted.value.address) return;
    refreshWalletState();
  }, [persisted.hydrated, persisted.value.address, refreshWalletState]);

  const connectWallet = async () => {
    setLoading(true);
    await persisted.setValue({ address: DEMO_WALLET });
    setLoading(false);
  };

  const disconnectWallet = async () => {
    await persisted.setValue({ address: null });
    setUsdcBalance(0);
    setNetworkError(null);
  };

  const requestNetworkSwitch = async () => {
    const ok = await switchNetwork();
    if (ok) {
      setNetworkError(null);
      await refreshWalletState();
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await refreshWalletState();
    setRefreshing(false);
  };

  return {
    walletAddress: persisted.value.address,
    hydrated: persisted.hydrated,
    connected,
    loading,
    refreshing,
    usdcBalance,
    networkError,
    connectWallet,
    disconnectWallet,
    requestNetworkSwitch,
    refresh
  };
};
