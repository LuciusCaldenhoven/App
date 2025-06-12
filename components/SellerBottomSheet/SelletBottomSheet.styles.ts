import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";
import { scale } from "@/constants/scale";


export const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: '#F4F4F8',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#F4F4F8',

    paddingTop: 30,
  },
  sheet: {
    maxHeight: "100%",
  },

  // --- Header del modal ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 21,
    fontFamily: "SemiBold",
    color: "black",

  },
  closeButton: {
    paddingRight: 10,
  },

  shareButton: {
    position: "relative",
    top: 2,
    left: 280,
    zIndex: 20,
    padding: 10,
  },
  card: {
    paddingLeft: 10,
    alignItems: "center",
    paddingBottom: 15,
  },

  number: {
    fontSize: 20,
    fontFamily: "Bold",
    marginLeft: 200,
    marginBottom: -16,
  },
  txtRating: {
    fontSize: 11,
    fontFamily: "SemiBold",
  },
  ratingRow: {
    marginLeft: 350,
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    gap: 4,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarContainer: {

    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  ratingBadge: {
    alignItems:'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#eab676', 
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50, 
    width:60,
    paddingVertical: 7,
    
  },

  ratingText: {
    color: 'white',
    fontFamily:'SemiBold',
    fontSize:16,
  },

  textReview: {
    fontFamily: "Medium",
    fontSize: 18,
    color: COLORS.black,
    marginVertical: 20,
    marginLeft: 10,

  },
  textName: {
    fontFamily: "Medium",
    fontSize: 20,
    color: COLORS.black,

    marginLeft: 10,
  },


  headerButtonsContainer: {
    flexDirection: "row",

    top: 30,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingLeft: 5,
  },
  textLocation: {
    fontFamily: "Regular",
    fontSize: 14,
  },
  ventasContainer: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "center",

  },
});