import { Animated, FlatList, RefreshControl, ScrollView, Text, View, Image } from "react-native";
import  styles  from "./feed.styles";

import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import React, { useRef, useState } from "react";
import Search from "@/components/search/index"
import { CategoryBox } from "@/components/categoryBox/categoryBox";
import { renderMarginBottom } from "@/constants/ui-utils";
import { products } from "./data";



export default function Index() {
    const [refreshing, setRefreshing] = useState(false);
    const posts = useQuery(api.posts.getFeedPosts)

    if (posts === undefined) return <Loader />


    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => { setRefreshing(false); }, 2000);
    };



    return (

        <View style={styles.container}>
            <View style={styles.appBarWrapper}>
                <View style={styles.appBar}>
                    <Ionicons name="location-outline" size={24} />
                    <Text style={styles.location}>Arequipa, Peru</Text>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.secondary} />
                }
            >
                {/* 🏆 Encabezado fijo con textos y barra de búsqueda */}
                <View style={{ backgroundColor: COLORS.background, paddingBottom: 10 }}>
                    <Text style={{ fontFamily: "Bold", fontSize: SIZES.xxLarge - 6, marginTop: SIZES.xSmall, color: COLORS.black, marginHorizontal: 12 }}>
                        Gana dinero extra
                    </Text>
                    <Text style={{ fontFamily: "Bold", fontSize: SIZES.xxLarge - 6, marginTop: 0, color: COLORS.primary, marginHorizontal: 12 }}>
                        Sin esfuerzo
                    </Text>

                    {/* Barra de búsqueda */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingBottom: 16, }}>
                        <Search shouldRedirect={true} />
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingBottom: 16, }}>
                        <CategoryBox
                            icon={<Image source={require('./assets/ropa.png')} style={{ width: 100, height: 100 }} />}
                            title="Ropa y Accesorios"
                            backgroundColor="#rgb(255, 235, 186)"
                            onPress={() => console.log('Restaurants')}
                            width={160}
                            height={140}
                            textColor="rgb(170, 106, 3))"
                        />
                        <CategoryBox
                            icon={<Image source={require('./assets/electronica.png')} style={{ width: 100, height: 100 }} />}
                            title="Electrónica"
                            backgroundColor="#rgb(150, 159, 240)"
                            onPress={() => console.log('Restaurants')}
                            width={160}
                            height={140}
                            textColor="#rgb(1, 12, 114)"
                        />
                    </View>
                    <View style={{ paddingHorizontal: 12, paddingBottom: 16 }}>
                        <FlatList
                            data={products} 
                            renderItem={({ item }) => (
                                <CategoryBox
                                    icon={<Image source={item.icon} style={{ width: 70, height: 70 }} />}
                                    title={item.title}
                                    backgroundColor={'rgb(240, 248, 248)'}
                                    onPress={() => console.log(item.title)}
                                />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ columnGap: 12 }}
                        />
                    </View>


                    {renderMarginBottom(50)}
                    <Text style={styles.titulo}>Las Novedadessss pa</Text>
                </View>

                {/* 🔄 Sección de productos con desplazamiento horizontal */}
                <FlatList
                    data={posts}
                    renderItem={({ item }) => <Post post={item} />}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ columnGap: 0, paddingLeft: 12, paddingRight: 12 }}
                />

            </ScrollView>
        </View>
    );
}

