import { scale } from "@/constants/scale";
import { COLORS, FontSize } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
  profileInfo: {
    padding: 16,
  },
  avatarAndStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 32,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  title: {
    fontSize: FontSize.FONT_16Px,
    fontFamily: "SemiBold",
  },
  text: {
    fontSize: FontSize.FONT_14Px,
    color: COLORS.placeholder,
    fontFamily: "Regular",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(12),
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: scale(10),
    borderRadius: scale(5),
    alignItems: "center",
    marginTop: scale(20),
  },
  buttonText: {
    fontSize: FontSize.FONT_16Px,
    color: COLORS.white,
    fontFamily: "SemiBold",
  },
  
  
  
});