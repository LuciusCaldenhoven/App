import { Animated, FlatList, RefreshControl, ScrollView, Text, View, Image, Button } from "react-native";
import styles from "@/styles/feed.styles";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import React, { useEffect, useRef, useState } from "react";
import Search from "@/components/search/index";
import { CategoryBox } from "@/components/categoryBox/categoryBox";
import { renderMarginBottom } from "@/constants/ui-utils";
import products from "@/assets/index/data";

export default function Index() {
    const [refreshing, setRefreshing] = useState(false);


    const posts = useQuery(api.posts.getFeedPosts);

    if (posts === undefined) return <Loader />;

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };


    if (posts === undefined) return <Loader />;

    if (posts.length === 0) {
        return (
            <View style={styles.container}>
                <NoPost />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.appBarWrapper}>
                <View style={styles.appBar}>
                    <Ionicons name="location-outline" size={24} />
                    <Text style={styles.location}>Arequipa, Peru</Text>
                </View>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.secondary} /> } >
                <View style={{ backgroundColor: COLORS.background, paddingBottom: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 10,
                            paddingBottom: 16,
                        }}
                    >
                        <Search shouldRedirect={true} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 25, paddingBottom: 16, }} >
                        <CategoryBox
                            icon={<Image source={require('@/assets/index/ropa.png')} style={{ width: 100, height: 100 }} />}
                            title="Ropa y Accesorios"
                            backgroundColor={COLORS.main_app1}
                            onPress={() => console.log('Ropa')}
                            width={160}
                            height={140}
                            textColor={COLORS.main_app2}
                        />
                        <CategoryBox
                            icon={<Image source={require('@/assets/index/electronica.png')} style={{ width: 100, height: 100 }} />}
                            title="Electrónica"
                            backgroundColor={COLORS.main_app3}
                            onPress={() => console.log('Electrónica')}
                            width={160}
                            height={140}
                            textColor="rgb(1, 12, 114)"
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

function NoPost() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            
            <Text style={{ fontSize: 16, color: "gray", textAlign: "center" }}>
                No hay publicaciones disponibles en este momento.
            </Text>
        </View>
    );
}
