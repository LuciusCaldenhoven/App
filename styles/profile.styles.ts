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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
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
  bio: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  shareButton: {
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 8,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gridItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.grey,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.white,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
  },
  postDetailContainer: {
    backgroundColor: COLORS.background,
    maxHeight: height * 0.9,
  },
  postDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  postDetailImage: {
    width: width,
    height: width,
  },

  noPostsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
    flex: 1,
  },
  noPostsText: {
    color: COLORS.grey,
    fontSize: 16,
  },

  
  username: {
    fontSize: 20,
    fontWeight: "bold",
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
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(12),
    justifyContent: 'space-between',
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
  }
  
  
  
});