import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/search.styles";
import { useRouter } from "expo-router";

export default function Search() {
  const router = useRouter(); // 🔥 Para redireccionar

  const handleFocus = () => {
    router.push("/search/searchResults"); // 🔥 Redirige a la página de búsqueda cuando el usuario toca el input
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="¿Qué estás buscando?"
          placeholderTextColor={COLORS.grey}
          onFocus={handleFocus} // ✅ Redirige cuando el usuario toca el input
        />
      </View>

      <TouchableOpacity style={styles.searchBtn} onPress={handleFocus}>
        <Feather name="search" size={24} color={COLORS.offwhite} />
      </TouchableOpacity>
    </View>
  );
}
