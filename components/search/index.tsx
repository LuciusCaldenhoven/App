import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/components/search/search.styles";
import { router, useRouter } from "expo-router";

interface SearchProps {
  shouldRedirect: boolean; 
}

export default function Search({ shouldRedirect }: SearchProps) {


  return (
    
      <TouchableOpacity style={styles.searchBtn} onPress={() => router.push({ pathname: "../search/searchResults" })}>
        <Ionicons name="search" size={24} color={COLORS.grey} />
        <TextInput
          style={styles.searchInput}
          placeholder={"Que quieres comprar"}
          placeholderTextColor={COLORS.grey}

        />
      </TouchableOpacity>

  );
}
