import { View, Text } from "react-native";

export default function SheetScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Soy un Sheet</Text>
      <Text>Esta pantalla debería abrirse como un BottomSheet nativo.</Text>
    </View>
  );
}