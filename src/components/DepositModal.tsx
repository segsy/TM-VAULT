import { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { DepositError, approveUsdc, depositToVault } from '../services/blockchain';
import { TxStatus, Vault } from '../types';
import { usd } from '../utils/format';

type Props = {
  visible: boolean;
  onClose: () => void;
  vault: Vault | null;
  usdcBalance: number;
  isConnected: boolean;
  hasNetworkError: boolean;
  onSuccess: (vaultId: Vault['id'], amountUsd: number, txHash: string, shares: number) => void;
};

const txStatusMessage: Record<Exclude<TxStatus, 'idle'>, string> = {
  approving: 'Approval transaction submitted…',
  'approve-confirmed': 'Approval confirmed. Starting deposit…',
  depositing: 'Deposit transaction submitted…',
  success: 'Deposit confirmed ✅',
  failed: 'Deposit failed'
};

export const DepositModal = ({ visible, onClose, vault, usdcBalance, isConnected, hasNetworkError, onSuccess }: Props) => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<TxStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const numericAmount = Number(amount || 0);
  const inFlight = status === 'approving' || status === 'depositing';

  const estimatedShares = useMemo(() => {
    if (!vault || !numericAmount) return 0;
    return numericAmount / vault.pricePerShare;
  }, [vault, numericAmount]);

  const fillQuick = (factor: number) => setAmount((usdcBalance * factor).toFixed(2));

  const runDeposit = async () => {
    if (!vault || numericAmount <= 0 || inFlight) return;
    if (!isConnected) {
      setError('Connect wallet before depositing.');
      setStatus('failed');
      return;
    }
    if (hasNetworkError) {
      setError('Switch to HyperEVM network before depositing.');
      setStatus('failed');
      return;
    }

    setError(null);

    try {
      setStatus('approving');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await approveUsdc(numericAmount, usdcBalance);

      setStatus('approve-confirmed');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setStatus('depositing');
      const receipt = await depositToVault(numericAmount, vault);

      setStatus('success');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess(vault.id, numericAmount, receipt.txHash, receipt.shares);
    } catch (e) {
      setStatus('failed');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (e instanceof DepositError) {
        setError(e.message);
      } else {
        setError('Unexpected blockchain error.');
      }
    }
  };

  const resetAndClose = () => {
    if (inFlight) return;
    setAmount('');
    setStatus('idle');
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={resetAndClose}>
      <View style={styles.scrim}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Deposit into {vault?.name}</Text>
          <Text style={styles.helper}>USDC Balance: {usd(usdcBalance)}</Text>

          <TextInput
            placeholder="Enter USDC amount"
            placeholderTextColor="#6c6c6c"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            editable={!inFlight}
          />

          <View style={styles.quickRow}>
            {[0.25, 0.5, 0.75, 1].map((factor, i) => (
              <Pressable key={factor} style={[styles.quick, inFlight && styles.disabled]} onPress={() => fillQuick(factor)} disabled={inFlight}>
                <Text style={styles.quickText}>{i === 3 ? 'MAX' : `${factor * 100}%`}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.helper}>Estimated Shares: {estimatedShares.toFixed(4)}</Text>
          <Text style={styles.helper}>Flow: Approve → Deposit</Text>
          {status !== 'idle' && (
            <View style={styles.statusRow}>
              {inFlight && <ActivityIndicator size="small" color="#8bb6ff" />}
              <Text style={styles.status}>{txStatusMessage[status]}</Text>
            </View>
          )}
          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable style={[styles.primary, inFlight && styles.disabled]} onPress={runDeposit} disabled={inFlight}>
            <Text style={styles.primaryText}>{inFlight ? 'Processing…' : 'Approve & Deposit'}</Text>
          </Pressable>
          <Pressable style={[styles.secondary, inFlight && styles.disabled]} onPress={resetAndClose} disabled={inFlight}>
            <Text style={styles.secondaryText}>{inFlight ? 'Please wait…' : 'Close'}</Text>
          </Pressable>

          {status === 'success' && <ConfettiCannon count={150} origin={{ x: 160, y: 0 }} fadeOut />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#121212', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, gap: 8 },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  helper: { color: '#afafaf' },
  input: { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 10, padding: 12, marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  quick: { flex: 1, alignItems: 'center', padding: 8, borderRadius: 8, backgroundColor: '#2a2a2a' },
  quickText: { color: '#fff' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  status: { color: '#8bb6ff' },
  error: { color: '#ff7e7e' },
  primary: { marginTop: 8, backgroundColor: '#5f6fff', borderRadius: 10, padding: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { borderRadius: 10, padding: 10, alignItems: 'center' },
  secondaryText: { color: '#d0d0d0' },
  disabled: { opacity: 0.55 }
});
