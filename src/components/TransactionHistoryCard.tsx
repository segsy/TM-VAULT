import { StyleSheet, Text, View } from 'react-native';
import { TransactionHistoryItem } from '../types';
import { usd } from '../utils/format';

type Props = {
  items: TransactionHistoryItem[];
};

const statusColors = {
  pending: '#f1c40f',
  confirmed: '#2ecc71',
  failed: '#ff7e7e'
};

export const TransactionHistoryCard = ({ items }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>Recent Activity</Text>
    {items.length === 0 ? (
      <Text style={styles.empty}>No transactions yet.</Text>
    ) : (
      items.slice(0, 5).map((tx) => (
        <View style={styles.row} key={tx.id}>
          <View>
            <Text style={styles.name}>{tx.vaultName}</Text>
            <Text style={styles.meta}>{new Date(tx.createdAt).toLocaleString()}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.amount}>{usd(tx.amountUsd)}</Text>
            <Text style={[styles.status, { color: statusColors[tx.status] }]}>{tx.status.toUpperCase()}</Text>
          </View>
        </View>
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#0f151d', borderRadius: 14, padding: 14, marginBottom: 12 },
  title: { color: '#fff', fontWeight: '700', marginBottom: 8 },
  empty: { color: '#9eb2c7' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomColor: '#1e2a38', borderBottomWidth: 1 },
  name: { color: '#fff', fontWeight: '600' },
  meta: { color: '#8ea1b5', fontSize: 12, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { color: '#fff' },
  status: { fontSize: 12, fontWeight: '700', marginTop: 2 }
});
