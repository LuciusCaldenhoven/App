import React from "react";
import { View, Text, Dimensions, StyleSheet, } from "react-native";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming, } from "react-native-reanimated";
import { es } from "date-fns/locale";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Id } from "@/convex/_generated/dataModel";

const ITEM_HEIGHT = 80;
const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = -width * 0.15;

interface Notification {
  _id: Id<"notifications">;
  sender: {
    _id: string;
    fullname: string;
    image: string;
  } | null;
  type: "message" | "app" | "review";
  _creationTime: Date;
  text: string;
}

interface NotificationItemProps {
  item: Notification;
  onDelete?: (item: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onDelete }) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      skewX.value = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 25], Extrapolation.CLAMP);
      skewY.value = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 5], Extrapolation.CLAMP);
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onDelete) runOnJS(onDelete)(item);
        });
      } else {
        translateX.value = withSpring(0, { damping: 10, stiffness: 100 });
        skewX.value = withTiming(0);
        skewY.value = withTiming(0);
      }
    });

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { skewX: `${skewX.value}deg` },
      { skewY: `${skewY.value}deg` },
    ],
    backgroundColor: interpolateColor(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      ["white", "lightcoral"]
    ),
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value,
    opacity: opacity.value,
  }));

  const animatedTrashStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < SWIPE_THRESHOLD ? 1 : 0,
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [SWIPE_THRESHOLD, SWIPE_THRESHOLD - 50],
          [1, 1.2],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (

    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {/* Tu ícono de tacho original */}
      <Animated.View style={[styles.trashContainer, animatedTrashStyle]}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/128/6460/6460112.png" }}
          style={styles.iconTrash}
        />
      </Animated.View>

      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.item, animatedItemStyle]}>

          {/* FOTO DE PERFIL O ICONO DEL SISTEMA */}
          <View style={{ position: "relative", width: 48, height: 48 }}>
            {/* Foto de perfil o ícono del sistema */}
            {item.type === "app" ? (
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/1055/1055646.png" }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                contentFit="cover"
              />
            ) : (
              <>
                <Image
                  source={{ uri: item.sender?.image }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                  contentFit="cover"
                  transition={200}
                />

                {/* Estrella para tipo review */}
                {(item.type === "review" || item.type === "message") && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "white",
                      borderRadius: 15,
                      padding: 3.5,
                    }}
                  >
                    {item.type === "review" ? (
                      <FontAwesome name="star" size={15} color="#FFD700" />
                    ) : (
                      <Ionicons name="chatbubble" size={15} color="#007AFF" />
                    )}
                  </View>
                )}
              </>
            )}
          </View>


          {/* TEXTO */}
          <View style={styles.textContainer}>
            <View style={styles.timeContainer}>
              <Text numberOfLines={1} style={styles.title} ellipsizeMode="tail">
                {item.type === "app" ? "Diuna App" : item.sender?.fullname}
              </Text>
              <Text numberOfLines={1} style={styles.time}>
                {formatDistanceToNow(item._creationTime, { addSuffix: true, locale: es })}
              </Text>
            </View>

            <Text numberOfLines={2} style={styles.description}>
              {item.text}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>

  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontFamily: 'Medium'
  },
  trashContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
    width: 60,
  },
  iconTrash: {

    top: 20,
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  icon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
  },
  item: {
    alignItems: "center",
    width: "100%",
    height: ITEM_HEIGHT,
    justifyContent: "flex-start",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    backgroundColor: "white",
    marginVertical: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 12,
    color: "black",
    fontFamily: 'Medium',
    flexShrink: 1,
    flexGrow: 1,
    maxWidth: "75%",
  },
  description: {
    fontSize: 12,
    color: "grey",
    fontFamily: 'Medium',
    marginTop: 5,
  },
  textContainer: {
    paddingLeft: 10,
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  time: {
    fontSize: 10,
    color: "grey",
    fontFamily: 'Medium',
    flexShrink: 0,
    flexGrow: 0,
  },
  timeContainer: {
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
