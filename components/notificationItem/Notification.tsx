import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const ITEM_HEIGHT = 80;
const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = -width * 0.3;

interface Notification {
  sender: {
    _id: string;
    username: string;
    image: string;
  };
  type: "like" | "comment" | "follow" | "favorite" | "review" | "message";
  _creationTime: Date;
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
    <GestureHandlerRootView>
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
            <Image source={item.sender.image} style={styles.icon} contentFit="cover" transition={200} />
            <View style={styles.textContainer}>
              <View style={styles.timeContainer}>
                <Text style={styles.title}>{item.sender.username}</Text>
                <Text numberOfLines={1} style={styles.time}>
                  {formatDistanceToNow(item._creationTime, { addSuffix: true })}
                </Text>
              </View>
              <Text numberOfLines={2} style={styles.description}>
                Muy atento, responde rápido y sus productos son de calidad...
              </Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
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
    fontWeight: "600",
  },
  description: {
    fontSize: 12,
    color: "grey",
    fontWeight: "500",
    marginTop: 5,
  },
  textContainer: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  time: {
    fontSize: 10,
    color: "grey",
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
