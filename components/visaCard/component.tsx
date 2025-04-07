import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles } from './styles';
import { COLORS } from '@/constants/theme';

const VisaCard = () => {
  const cardNumber = '2323 1223 2323 1234';
  const name = 'Lucius Caldenhoven';
  const expiry = '12/26';

  const styles = createStyles();

  return (
    <LinearGradient
      colors={[
        COLORS.visaCard.primary,
        COLORS.visaCard.secondary,
        COLORS.visaCard.gray,
        COLORS.visaCard.gray2,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <Text style={styles.visaText}>VISA</Text>
      <View style={styles.rowG20}>
        <View style={styles.bottomRow}>
          <View style={styles.nameRow}>
            <Text style={styles.info}>{name}</Text>
            <View style={styles.expireRow}>
              <Text style={styles.label}>Expira</Text>
              <Text style={styles.info}>{expiry}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
      </View>
    </LinearGradient>
  );
};

export default VisaCard;