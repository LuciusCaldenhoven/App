import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions, ScrollView, Dimensions, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // si usas expo-router
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductSkeleton from "@/components/loaders/ProductSkeleton";
import Post from "@/components/Post";
import ReviewComponent from "@/components/review/component";
import ReviewComponentVertical from "@/components/ReviewComponentVertical/ReviewComponentVertical";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { COLORS } from "@/constants/theme";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,

} from "react-native-reanimated"; 
import TopSection from "@/components/ProductSelleInfo/TopSection";



const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16;

const HEADER_HEIGHT = 50;
export default function SellerScreen() {
    const router = useRouter();
    const { authorId } = useLocalSearchParams();
    const author = useQuery(api.users.getById, { userId: authorId as Id<"users"> });
    const posts = useQuery(api.posts.getPostsByUser, { userId: authorId as Id<"users"> });
    const [showAllReviews, setShowAllReviews] = useState(false);

    const postsSold = useQuery(api.posts.getSoldPostsByUser, { userId: author?._id });

    const [activeTab, setActiveTab] = useState("Productos");

    const scrollY = useSharedValue(0);
    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        },
    });

    if (!author) return null;

    const displayName = typeof author.fullname === "string" && author.fullname.trim().length > 0 ? author.fullname.trim().split(" ").slice(0, 2).join(" ") : "User";

    return (
    <View style={styles.container}>
 
        <TopSection
          currentUser={author}
          scrollY={scrollY}
        />
 

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 230,
          paddingBottom: 300,
        }}
        onScroll={handleScroll} 
        scrollEventThrottle={16}
      >
        <View style={styles.scrollContent}>
          

            <View>
            <View style={{ paddingTop: 10, backgroundColor: 'white' }}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, activeTab === "Productos" && styles.activeButton]}
                        onPress={() => setActiveTab("Productos")}
                    >
                        <Text style={[styles.buttonText, activeTab === "Productos" && styles.activeButtonText]}>
                            Productos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, activeTab === "Reviews" && styles.activeButton]}
                        onPress={() => setActiveTab("Reviews")}
                    >
                        <Text style={[styles.buttonText, activeTab === "Reviews" && styles.activeButtonText]}>
                            Reviews
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        
            {activeTab === "Productos" ? (
                    !posts ? (
                        <FlatList
                            data={Array.from({ length: 8 })}
                            numColumns={2}
                            keyExtractor={(_, index) => `skeleton-${index}`}
                            renderItem={() => <ProductSkeleton />}
                            columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12, marginBottom: 16 }}
                            contentContainerStyle={{ paddingTop: 20 }}
                            scrollEnabled={false}
                        />
                    ) : posts.length === 0 ? (
                        <Text style={{ textAlign: "center", marginTop: 20 }}>No hay productos</Text>
                    ) : (
                        <FlatList
                            data={posts}
                            numColumns={2}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => <Post post={item} isBookmarked={false} />}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            contentContainerStyle={{ paddingHorizontal: 12 }}
                            scrollEnabled={false}
                        />
                    )
                ) : (
          
                    <View style={{ flex: 1 }}>
                    <View style={styles.floatingButton}>
                      <TouchableOpacity onPress={() => setShowAllReviews(true)}>
                        <Text style={styles.floatingButtonText}>Ver más</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView>
                      <ReviewComponent sellerId={author._id} />
                    </ScrollView>

                    {/* Floating Button */}
                    

                    <ReviewComponentVertical
                      visible={showAllReviews}
                      onClose={() => setShowAllReviews(false)}
                      sellerId={author._id}
                    />
                  </View>

             
                )}
                </View>

     


        </View>


      </Animated.ScrollView>

    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
    floatingButton: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: COLORS.black,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      zIndex: 999,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },

    floatingButtonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
    },
buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",

        alignItems: "flex-start",
        marginBottom: 5,
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
        button: {
        flex: 1,
        marginHorizontal: 30,
        paddingVertical: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        alignItems: "center",

    },
  containerCarousel: {
    paddingTop: 20,
    alignItems: "center",
  },
  SectionContainer: {
    paddingHorizontal: 20,
    
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Medium',
    color: "#111",
  },

  iconWrapper2: {
    alignItems: 'center',
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 999,
    width: 45,
  },

  item: {

    alignItems:'center',
    width: "100%",
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "85%",
    height: "100%",
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F7FA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",

    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: 'Regular'
  },

  iconWrapper: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2, // para Android
    zIndex: 100, 
  },
  stickyHeaderWrapper: {
  position: 'absolute',
  top: HEADER_HEIGHT,
  width: '100%',
  zIndex: 100,
  backgroundColor: 'white', // si tu fondo es blanco
  paddingBottom: 10,
},
  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 60,
    backgroundColor: "#F5F5F5", // gris claro
    justifyContent: "flex-end",
    paddingBottom: 20,

    
  },


   
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
   
    fontSize: 16,
    color: "#111",
    fontFamily: 'Medium'
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    fontFamily: 'Regular'
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  scroll: {
    flex: 1,

  },
  scrollContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -HEADER_HEIGHT / 2,
    paddingVertical: 20,

  },

  scrollText: {
    fontSize: 16,
    marginBottom: 12,
  },
  HorizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tab: {
    backgroundColor: "#F5F7FA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#adc92b", // azul oscuro
  },
  tabText: {
    fontSize: 14,
    color: "#222",

    fontFamily: 'Medium'
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
  },
  slider: {
    width: 300,
    height: 40,

  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kmLabel: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },

  kmValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },

  secondaryButtonText: {
    color: '#222',
    fontSize: 15,
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: '#7ea437',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  containerDown: {
    width: '95%',
    paddingVertical: 10,
    alignSelf: 'center',
    gap: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationTextContainer: {
    marginLeft: 10,
  },
  kmText: {
    fontSize: 13,
    fontFamily: 'Regular',
    color: '#444',
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Medium'
  },
});
