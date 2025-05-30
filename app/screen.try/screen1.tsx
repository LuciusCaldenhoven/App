import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // Para iconos tipo ojo, usuario, + y -

export default function MinimalistInputs() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('1000');
  const [input3, setInput3] = useState('1000');
  const [input4, setInput4] = useState('1000');
  const [input5, setInput5] = useState('1000');
  const [input6, setInput6] = useState('1000');
  const [input7, setInput7] = useState('1000');
  const [showPassword, setShowPassword] = useState(false);

  // Funciones para sumar/restar (simples)
  const increment = (value: string, setter: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: string): void; }) => {
    const num = Number(value) || 0;
    setter((num + 1).toString());
  };
  const decrement = (value: string, setter: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: string): void; }) => {
    const num = Number(value) || 0;
    setter(num > 0 ? (num - 1).toString() : '0');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* INPUT SIMPLE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={18} color="#666" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Enter your name..."
            value={input1}
            onChangeText={setInput1}
            placeholderTextColor="#999"
          />
          <TouchableOpacity>
            <Feather name="eye" size={18} color="#666" style={styles.iconRight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>This is an input helper text.</Text>
      </View>

      {/* INPUT CON BORDE GRIS CLARO */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <View style={[styles.inputWrapper, styles.inputGrayBorder]}>
          <Feather name="user" size={18} color="#666" style={styles.iconLeft} />
          <TextInput
            style={styles.input}
            placeholder="Enter your name..."
            value={input1}
            onChangeText={setInput1}
            placeholderTextColor="#999"
          />
          <TouchableOpacity>
            <Feather name="eye" size={18} color="#666" style={styles.iconRight} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>This is an input helper text.</Text>
      </View>

      {/* INPUT CON BORDE AZUL */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <View style={[styles.inputWrapper, styles.inputBlueBorder]}>
          <Feather name="user" size={18} color="#0a5fff" style={styles.iconLeft} />
          <TextInput
            style={[styles.input, { color: '#0a5fff' }]}
            placeholder="Enter your name..."
            placeholderTextColor="#aac4ff"
            value={input1}
            onChangeText={setInput1}
          />
          <TouchableOpacity>
            <Feather name="eye" size={18} color="#0a5fff" style={styles.iconRight} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.helperText, { color: '#aac4ff' }]}>
          This is an input helper text.
        </Text>
      </View>

      {/* INPUT NÚMERICO CON BOTONES */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Input Label</Text>
        <View style={[styles.inputWrapper, styles.inputBlueBorder]}>
          <Feather name="user" size={18} color="#0a5fff" style={styles.iconLeft} />
          <TextInput
            style={[styles.input, { color: '#0a5fff', textAlign: 'center', flex: 1 }]}
            keyboardType="numeric"
            value={input2}
            onChangeText={setInput2}
          />
          <TouchableOpacity onPress={() => decrement(input2, setInput2)} style={styles.buttonSide}>
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={() => increment(input2, setInput2)} style={styles.buttonSide}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.helperText, { color: '#aac4ff' }]}>
          This is an input helper text.
        </Text>
      </View>

      {/* INPUT NÚMERICO CON BORDE ROJO */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: '#d94242' }]}>Input Label</Text>
        <View style={[styles.inputWrapper, styles.inputRedBorder]}>
          <Feather name="user" size={18} color="#d94242" style={styles.iconLeft} />
          <TextInput
            style={[styles.input, { color: '#d94242', textAlign: 'center', flex: 1 }]}
            keyboardType="numeric"
            value={input3}
            onChangeText={setInput3}
          />
          <TouchableOpacity onPress={() => decrement(input3, setInput3)} style={styles.buttonSide}>
            <Text style={[styles.buttonText, { color: '#d94242' }]}>−</Text>
          </TouchableOpacity>
          <View style={[styles.separator, { backgroundColor: '#d94242' }]} />
          <TouchableOpacity onPress={() => increment(input3, setInput3)} style={styles.buttonSide}>
            <Text style={[styles.buttonText, { color: '#d94242' }]}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.helperText, { color: '#d94242' }]}>
          This is an input helper text.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 6,
    color: '#222',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: '#444',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  inputGrayBorder: {
    borderColor: '#ddd',
  },
  inputBlueBorder: {
    borderColor: '#0a5fff',
  },
  inputRedBorder: {
    borderColor: '#d94242',
  },
  buttonSide: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0a5fff',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#0a5fff',
  },
});
