import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Vault } from '../types';
import { compactUsd, usd } from '../utils/format';

const riskColor = {
  Low: '#2ecc71',
  Medium: '#f1c40f',
  High: '#e74c3c'
};

type Props = {
  vault: Vault;
  onDeposit: (vault: Vault) => void;
};

export const VaultCard = ({ vault, onDeposit }: Props) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>{vault.name}</Text>
      <View style={[styles.riskPill, { backgroundColor: riskColor[vault.risk] }]}>
        <Text style={styles.riskText}>{vault.risk}</Text>
      </View>
    </View>
    <Text style={styles.meta}>Target APY: {vault.apy}</Text>
    <Text style={styles.meta}>Your Balance: {usd(vault.userBalanceUsd)}</Text>
    <Text style={styles.meta}>TVL: {compactUsd(vault.tvl)}</Text>
    <Pressable style={styles.button} onPress={() => onDeposit(vault)}>
      <Text style={styles.buttonText}>Deposit</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#151515', borderRadius: 14, padding: 14, gap: 6, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontWeight: '700', fontSize: 16 },
  riskPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  riskText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  meta: { color: '#c4c4c4' },
  button: { marginTop: 8, backgroundColor: '#5f6fff', borderRadius: 10, padding: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});
