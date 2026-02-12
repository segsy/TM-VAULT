import { StyleSheet, Text, View } from 'react-native';
import { Position } from '../types';
import { usd } from '../utils/format';

type Props = { positions: Position[] };

export const PortfolioCard = ({ positions }: Props) => {
  const total = positions.reduce((sum, p) => sum + p.usdValue, 0);

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Portfolio</Text>
      <Text style={styles.total}>{usd(total)}</Text>
      {positions.length === 0 ? (
        <Text style={styles.empty}>No active positions yet.</Text>
      ) : (
        positions.map((p) => (
          <View style={styles.row} key={p.vaultId}>
            <Text style={styles.label}>{p.vaultName}</Text>
            <Text style={styles.value}>{usd(p.usdValue)}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#101922', borderRadius: 14, padding: 14, marginBottom: 12 },
  header: { color: '#8bb6ff', fontWeight: '700' },
  total: { color: '#fff', fontSize: 22, marginVertical: 8, fontWeight: '700' },
  empty: { color: '#9eb2c7' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  label: { color: '#fff' },
  value: { color: '#9de4a0', fontWeight: '600' }
});
