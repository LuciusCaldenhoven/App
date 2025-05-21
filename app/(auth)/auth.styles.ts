import { COLORS } from "@/constants/theme";
import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  introText: {
    color: "Black",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Regular',
    paddingBottom: 10,
  },

  emailText: {
    fontFamily: "Medium",
    color: "black",
    paddingBottom: 10,
  },

  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  profileEmail: {
    fontSize: 14,
    color: "#ccc",
  },


  viewText: {
    color: "#666",
    fontFamily: "Medium"
  },

  legalText: {
    fontSize: 12,
    color: "black",
    textAlign: "left",
    paddingVertical: 5,
  },

  link: {
    color: "#00cc99",
    textDecorationLine: "underline",
  },

  continueButton: {
    backgroundColor: "#00cc99",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  card: {
    position: "absolute",
    top: 300,
    left: 10,
    right: 10,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Medium',
    marginBottom: 16,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Medium',
    color: "#000",
    backgroundColor: "transparent",
  },

  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#3b5f41",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 28,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Medium"
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 12,
    color: "black",
    fontFamily: "Regular"
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 40,
  },
  socialIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  registerText: {
    textAlign: "left",
    color: "black",
    fontFamily: "Regular"
  },
  registerLink: {
    color: COLORS.black,
    fontFamily: 'Medium'
  },
  loginSection: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 20,
    width: "100%",
    maxWidth: 300,
    position: "relative",
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.black,
    maxWidth: 280,
    fontFamily: 'Regular'
  },
  subtext: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  button: {
    backgroundColor: "#00cc66",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  socialButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  socialText: {
    color: "#fff",
  },
  welcome: {
    fontSize: 40,
    fontFamily: "SemiBold",
    bottom: 160,
    left: 15,
  }
});