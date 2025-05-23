import { Platform, StatusBar, StyleSheet } from "react-native";
import { COLORS, FontSize } from "@/constants/theme";
import { scale } from "@/constants/scale";

const styles = StyleSheet.create({

     container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
  },
  title:{
    fontSize: 28,
    fontFamily: "SemiBold",
    color: COLORS.black,
    paddingTop: 20,
    paddingHorizontal: scale(18),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 40,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 30,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    alignItems: "center",

  },
  activeButton: {
    backgroundColor: COLORS.black,
  },
  buttonText: {
    fontSize: 12,
    color: COLORS.black,
    fontFamily: "Regular",
  },
  activeButtonText: {
    color: "#fff",
    fontFamily: "Regular",
  },
  listContainer: {
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginHorizontal: scale(18),
  },
});

export default styles;