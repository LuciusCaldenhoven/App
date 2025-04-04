import { View, Text, Image } from "react-native";
import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";

interface Review {
  comment: string;
  rating: number;
  _creationTime: number;
  user: {
    fullname: string;
    image: string;
  };
}

export default function Review({ review }: { review: Review }) {
  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: review.user.image }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{review.user.fullname}</Text>
        <Text style={styles.commentText}>{`⭐ ${review.rating} - ${review.comment}`}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(review._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
