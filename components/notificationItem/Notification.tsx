import { COLORS } from "@/constants/theme";
import { styles } from "@/components/notificationItem/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated, } from "react-native";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import { FC, useRef } from "react";
import { Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

interface Notification {
  sender: {
    _id: string;
    username: string;
    image: string;
  };
  type: "like" | "comment" | "follow" | "favorite" | "review" | "message";
  comment?: string;
  post?: {
    imageUrl: string;
  };
  _creationTime: Date;
}

interface NotificationItemProps {
  item: Notification;
  onDelete?: (item: Notification) => void;
}

const ITEM_HEIGHT = 80;
const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = -width * 0.3;

const NotificationItem: FC<NotificationItemProps> = ({ item, onDelete }) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);

  const swipeGesture = Gesture.Pan().onUpdate((event) => {
    translateX.value = event.translationX;
    skewX.value = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 25],
      Extrapolation.CLAMP
    );

    skewY.value = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 5],
      Extrapolation.CLAMP
    );
  })
    .onEnd(() => {
      const shouldDelete = translateX.value < SWIPE_THRESHOLD;

      if (shouldDelete) {
        translateX.value = withTiming(-width);
        itemHeight.value = withTiming(0);
        marginVertical.value = withTiming(0);
        opacity.value = withTiming(0, undefined, isFinished => {
          if (isFinished && onDelete) {
            runOnJS(onDelete)(item);
          }
        });
      } else {
        translateX.value = withSpring(0, { damping: 10, stiffness: 100 });
        skewX.value = withTiming(0);
        skewY.value = withTiming(0);
      }

    });

  const animatedItemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { skewX: `${skewX.value}deg` },
        { skewY: `${skewY.value}deg` },
      ],
      backgroundColor: interpolateColor(
        translateX.value,
        [0, SWIPE_THRESHOLD],
        ['white', 'lightcoral']
      ),
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value,
    opacity: opacity.value
  }));

  const animatedTrashStyle = useAnimatedStyle(() => ({
    opacity: withTiming(translateX.value < SWIPE_THRESHOLD ? 1 : 0),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [SWIPE_THRESHOLD, SWIPE_THRESHOLD - 50],
          [1, 1.2],
          Extrapolation.CLAMP,
        ),
      },
    ],

  }));

  return (
    <GestureHandlerRootView>
      <Animated.View style={[styles.containerNot, animatedContainerStyle]}>
        <Animated.View style={[styles.delete, animatedTrashStyle]}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/6460/6460112.png' }} style={styles.icon} />
        </Animated.View>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.item, animatedItemStyle]}>
            <Image source={item.sender.image} style={styles.icon} contentFit="cover" transition={200} />
            <View style={styles.textContainer}>
              <View style={styles.timeContainer}>
                <Text style={styles.title}>{item.sender.username}</Text>
                <Text numberOfLines={2} style={styles.time}> {formatDistanceToNow(item._creationTime, { addSuffix: true })} </Text>
              </View>
              <Text numberOfLines={2} style={styles.description}> Muy atento00, responde super rápido y sus productos son de buena calidad... </Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default NotificationItem;

// export default function Notification({ notification }: NotificationProps) {
//     const scrollRef = useRef(null);

//     return (

// <View style={styles.notificationItem}>
//     <View style={styles.notificationContent}>
//         <Link href={`/user/${notification.sender._id}`} asChild>
//             <TouchableOpacity style={styles.avatarContainer}>
//                 <Image
//                     source={notification.sender.image}
//                     style={styles.avatar}
//                     contentFit="cover"
//                     transition={200}
//                 />
//                 <View style={styles.iconBadge}>
//                     {notification.type === "like" ? (
//                         <Ionicons name="heart" size={14} color={COLORS.primary} />
//                     ) : notification.type === "follow" ? (
//                         <Ionicons name="person-add" size={14} color="#85B5F6" />
//                     ) : (
//                         <Ionicons name="chatbubble" size={14} color="#3B82F6" />
//                     )}
//                 </View>
//             </TouchableOpacity>
//         </Link>
//         <View style={styles.notificationInfo}>

//             <Link href={`/user/${notification.sender._id}`} asChild>
//                 <TouchableOpacity>
//                     <Text style={styles.username}>{notification.sender.username}</Text>
//                 </TouchableOpacity>
//             </Link>

//             <Text style={styles.action}>
//                 {notification.type == "follow"
//                     ? "started following you"
//                     : notification.type == "like"
//                         ? "liked your post"
//                         : `commented: "${notification.comment}"`
//                 }
//             </Text>
//             <Text style={styles.timeAgo}>
//                 {formatDistanceToNow(notification._creationTime, { addSuffix: true })}
//             </Text>
//         </View>
//     </View>
//     {notification.post && (
//         <Image
//             source={notification.post.imageUrl}
//             style={styles.postImage}
//             contentFit="cover"
//             transition={200}
//         />
//     )}

// </View>
//     );
// }
