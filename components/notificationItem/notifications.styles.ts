import { COLORS } from "@/constants/theme";
import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";

const ITEM_HEIGHT = 75;
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40, 
  },
  tabContainer: {
    width: 200,
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: COLORS.black,
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
    backgroundColor: COLORS.black,
  },
  tabText: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: "bold",
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
  slide: {
    width: 300, // Ajusta según el diseño
    justifyContent: "center",
    alignItems: "center",
  },
  slideText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scroll :{
    flex:1,
  },
  containerNot: {
    width: '100%',
    alignItems: 'center',
  },

  absoluteTrashContainer: {
  position: "absolute",
  top: 0,
  bottom: 0,
  right: 20,
  justifyContent: "center",
  alignItems: "center",
  zIndex: -1,
},

trashIcon: {
  width: 30,
  height: 30,
  tintColor: "#e74c3c",
},

  item: {
    alignItems: 'center',
    width: '100%',
    height: ITEM_HEIGHT,
    justifyContent: 'flex-start',
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.5) ',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderRadius : 10,

  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    borderRadius: 25,
    marginRight: 15,
},
title: {
  fontSize: 12,
  color: 'black',
  fontWeight: '600',
},
description: {
  fontSize: 12,
  color: 'grey',
  fontWeight: '500',
  marginTop: 5,
},
textContainer: {
  height: '100%',
    flex : 1,
    justifyContent: 'center',
},
time :{
  fontSize : 10,
  color : 'grey',
  fontWeight : '500',
},
timeContainer:{
  flexDirection: 'row',
  justifyContent: 'space-between',
},
delete: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 20,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: -1,
},

  
});