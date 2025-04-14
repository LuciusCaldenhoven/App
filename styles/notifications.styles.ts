import { COLORS } from "@/constants/theme";
import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40, 
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.black,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});