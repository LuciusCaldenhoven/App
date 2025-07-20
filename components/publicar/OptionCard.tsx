import { Info } from 'lucide-react-native';
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, StyleSheet, Dimensions } from 'react-native';

const PALETTE = {
  marca: "#adc92b",
  grisBtn: "#bababa",
};

const CARD_IMG_SIZE = Math.round(Dimensions.get('window').width * 0.37);

type OptionCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  image: any;
};

export default function OptionCard({
  title,
  description,
  selected,
  onPress,
  image,
}: OptionCardProps) {
  const anim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false,
      friction: 7,
      tension: 90,
    }).start();
  }, [selected]);

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#eee", PALETTE.marca],
  });
  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [75, CARD_IMG_SIZE + 15],
  });

  const imageOpacity = anim.interpolate({
    inputRange: [0, 0.9, 1],
    outputRange: [0, 0, 1],
  });

  const beneficioColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#bababa", "#222"],
  });

  return (
    <TouchableOpacity
      style={{ marginBottom: 10, width: "100%" }}
      activeOpacity={0.91}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.card,
          {
            borderColor,
            height,
            alignItems: "flex-start",
            flexDirection: "column",
            justifyContent: "center",
          },
        ]}
      >
        {selected && image && (
          <Animated.View style={{ opacity: imageOpacity, alignSelf: "center", marginTop: 2, paddingBottom: 12 }}>
            <Image
              source={image}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </Animated.View>
        )}
          <View style={styles.textBlock}>
            {/* BENEFICIO + TÍTULO */}
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
  <Text
    style={[
      styles.cardTitle,
      {
        color: "#222",
        fontSize: 17,
        marginBottom: 6,
        textAlign: "left",
        alignSelf: "flex-start",
        flex: 1,
      },
    ]}
    numberOfLines={1}
  >
    {title}
  </Text>


</View>


          {/* DESCRIPCIÓN */}
          <Text style={[ styles.cardDesc, { color: selected ? "#222" : "#9a9a9a", fontSize: 14, marginBottom: 0, textAlign: "left", lineHeight: 20, alignSelf: "flex-start", }, ]} numberOfLines={2} >
            {description}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#adc92b",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 75,
    maxHeight: 170,
  },
  cardImage: {
    width: 200,
    height: 85,
    borderRadius: 12,
    alignSelf: "center",
  },
  textBlock: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
  },
  beneficio: {
    fontSize: 14.7,
    fontFamily: "Medium",
    letterSpacing: 0.02,
    minWidth: 70,
    textAlign: "right",
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: "SemiBold",
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.07,
    fontFamily: "Regular",
    paddingBottom:5,
  },
});
