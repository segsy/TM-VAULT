import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DepositModal } from './src/components/DepositModal';
import { PortfolioCard } from './src/components/PortfolioCard';
import { TransactionHistoryCard } from './src/components/TransactionHistoryCard';
import { VaultCard } from './src/components/VaultCard';
import { useWallet } from './src/hooks/useWallet';
import { computePositions, vaults as seedVaults } from './src/services/blockchain';
import { TransactionHistoryItem, Vault } from './src/types';
import { truncateAddress, usd } from './src/utils/format';

export default function App() {
  const {
    connected,
    hydrated,
    walletAddress,
    usdcBalance,
    loading,
    refreshing,
    networkError,
    connectWallet,
    disconnectWallet,
    requestNetworkSwitch,
    refresh
  } = useWallet();
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [vaultData, setVaultData] = useState(seedVaults);
  const [history, setHistory] = useState<TransactionHistoryItem[]>([]);

  const positions = useMemo(() => computePositions(vaultData), [vaultData]);

  const handleDepositSuccess = (vaultId: Vault['id'], amountUsd: number, txHash: string, shares: number) => {
    const changedVault = vaultData.find((v) => v.id === vaultId);
    if (!changedVault) return;

    setVaultData((prev) => prev.map((v) => (v.id === vaultId ? { ...v, userBalanceUsd: v.userBalanceUsd + amountUsd } : v)));
    setHistory((prev) => [
      {
        id: `${vaultId}-${Date.now()}`,
        type: 'deposit',
        vaultId,
        vaultName: changedVault.name,
        amountUsd,
        shares,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        txHash
      },
      ...prev
    ]);
  };

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
        <Text style={styles.title}>TM Vault</Text>
        <Text style={styles.subtitle}>Mobile investor experience for HyperEVM vaults</Text>

        <View style={styles.walletCard}>
          <Text style={styles.cardTitle}>Wallet</Text>
          <Text style={styles.label}>Address: {truncateAddress(walletAddress ?? undefined)}</Text>
          <Text style={styles.label}>USDC: {usd(usdcBalance)}</Text>

          {!connected ? (
            <Pressable style={styles.actionButton} onPress={connectWallet}>
              <Text style={styles.actionText}>{loading ? 'Connecting...' : 'Connect Wallet'}</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.disconnectButton} onPress={disconnectWallet}>
              <Text style={styles.actionText}>Disconnect</Text>
            </Pressable>
          )}

          {networkError ? (
            <View style={styles.networkWarning}>
              <Text style={styles.networkText}>{networkError}</Text>
              <Pressable onPress={requestNetworkSwitch} style={styles.switchButton}>
                <Text style={styles.switchText}>Switch to HyperEVM</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.networkOk}>Network: HyperEVM ✅</Text>
          )}
        </View>

        <PortfolioCard positions={positions} />
        <TransactionHistoryCard items={history} />

        <Text style={styles.sectionTitle}>Vaults</Text>
        {vaultData.map((vault) => (
          <VaultCard key={vault.id} vault={vault} onDeposit={setSelectedVault} />
        ))}
      </ScrollView>

      <DepositModal
        visible={Boolean(selectedVault)}
        vault={selectedVault}
        usdcBalance={usdcBalance}
        isConnected={connected}
        hasNetworkError={Boolean(networkError)}
        onClose={() => setSelectedVault(null)}
        onSuccess={handleDepositSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05070a' },
  loadingScreen: { flex: 1, backgroundColor: '#05070a', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 36 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#8c96a1', marginTop: 4, marginBottom: 14 },
  walletCard: { backgroundColor: '#121722', borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 6 },
  label: { color: '#d2d8df', marginBottom: 2 },
  actionButton: { marginTop: 10, backgroundColor: '#4a7eff', padding: 10, borderRadius: 10, alignItems: 'center' },
  disconnectButton: { marginTop: 10, backgroundColor: '#4d4d4d', padding: 10, borderRadius: 10, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700' },
  networkWarning: { marginTop: 10, backgroundColor: '#302018', borderRadius: 10, padding: 10 },
  networkText: { color: '#ffc29e' },
  switchButton: { marginTop: 6, backgroundColor: '#ff914d', borderRadius: 8, padding: 8, alignItems: 'center' },
  switchText: { color: '#241302', fontWeight: '700' },
  networkOk: { color: '#84dba2', marginTop: 10 },
  sectionTitle: { color: '#fff', marginVertical: 8, fontWeight: '700', fontSize: 18 }
});
