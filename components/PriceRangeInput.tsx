import { DollarSign } from 'lucide-react-native';
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PriceRangeInputProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

const PriceRangeInput: React.FC<PriceRangeInputProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {/* Mínimo */}
      <View style={styles.inputWrapper}>
        <View style={{paddingRight:5}}>
            <DollarSign size={20}/>
        </View>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={value[0].toString()}
          onChangeText={(text) => {
            const num = Number(text);
            if (!isNaN(num)) onChange([num, value[1]]);
          }}
          placeholder="0"
          placeholderTextColor="#999"
        />
      </View>

      {/* Guion separador */}
      <Text style={styles.dash}>-</Text>

      {/* Máximo */}
      <View style={styles.inputWrapper}>
        <View style={{paddingRight:5}}>
            <DollarSign size={20}/>
        </View>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={value[1].toString()}
          onChangeText={(text) => {
            const num = Number(text);
            if (!isNaN(num)) onChange([value[0], num]);
          }}
          placeholder="100000000"
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
};

export default PriceRangeInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Si tu versión no soporta gap, usa margin en el dash
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    flex: 1,
  },
  currency: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: 20,
    color: '#000',
  },
  dash: {
    marginHorizontal: 4,
    fontSize: 16,
    color: '#000',
  },
});
