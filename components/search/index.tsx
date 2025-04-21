import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/components/search/search.styles";
import { useRouter } from "expo-router";

interface SearchProps {
  shouldRedirect: boolean; 
  placeholder?: string;
  onChangeText?: (text: string) => void;

  value?: string;
}

export default function Search({ shouldRedirect,placeholder = "¿Qué quieres comprar?", onChangeText, value, }: SearchProps) {
  const router = useRouter(); 
  const translateY = useRef(new Animated.Value(0)).current; 
  const [backgroundColor, setBackgroundColor] = useState<string>(COLORS.background); 
  const [searchText, setSearchText] = useState("");

  const handleFocus = () => {
    setBackgroundColor('red');
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleSearch = () => {
    if (shouldRedirect && searchText.trim() !== "") {
      router.push("/search/searchResults");
    }
  };

  return (
    <Animated.View style={[styles.actionRow, { transform: [{ translateY }], backgroundColor }]}>
      <TouchableOpacity style={styles.searchBtn} onPress={handleFocus}>
        <Ionicons name="search" size={24} color={COLORS.grey} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={COLORS.grey}
          onChangeText={onChangeText}
          onSubmitEditing={handleSearch}
          value={value}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
