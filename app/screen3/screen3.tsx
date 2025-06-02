import LoaderChats from "@/components/loaders/loaderChats";
import LoaderPosts from "@/components/loaders/loaderPosts";
import { View, Text } from "react-native";

export default function Screen3() {
  return (
    <View style={{ flex: 1 }}>
      <LoaderPosts/>
    </View>

  );
}
