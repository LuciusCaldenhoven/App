import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, StatusBar, Share, Alert, SafeAreaView, ScrollView, } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ImageView from "react-native-image-viewing";

const W = Dimensions.get("window").width;

export default function ManageProductScreen() {
  // HOOK 1
  const params = useLocalSearchParams<{ postId?: string | string[] }>();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;

  const postArgs = useMemo(() => (postId ? { postId } : "skip"), [postId]);

  // HOOK 2
  const post = useQuery(api.posts.getPostById as any, postArgs);

  const storageIds = useMemo(
    () =>
      post
        ? [
            ...(post.storageId ? [post.storageId] : []),
            ...(Array.isArray(post.imageUrls) ? post.imageUrls : []),
          ]
        : [],
    [post]
  );

  const galleryArgs = useMemo(
    () => (storageIds.length ? { storageIds } : "skip"),
    [storageIds]
  );

  // HOOK 3
  const gallery = useQuery(
    api.posts.getAllImageUrls as any,
    galleryArgs
  ) as string[] | undefined;

  // Mutations
  const deletePost = useMutation(api.posts.deletePost);
  const markAsSold = useMutation(api.posts.markAsSold);
  // Estado local
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Feather name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerTitle}>Gestión</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={{ padding: 16 }}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: W * 0.5 }]} />
        </View>
      </SafeAreaView>
    );
  }

  function formatPrice(amount: number | string, currency: string) {
  const n =
    typeof amount === "number"
      ? amount
      : Number(String(amount).replace(/[^\d.-]/g, "")) || 0;

  // miles con comas (1,234)
  const withCommas = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const c = currency?.trim().toLowerCase();
  const isSoles =
    c === "soles" || c === "sol" || c === "s/." || c === "s/";

  // si no es soles, lo tratamos como dólares
  return isSoles ? `S/ ${withCommas}` : `$ ${withCommas}`;
}

  const galleryData = Array.isArray(gallery) ? gallery.filter(Boolean) : [];
  const imagesForModal = galleryData.map((uri) => ({ uri }));
  const total = galleryData.length;

  const onShare = async () => {
    try {
      await Share.share({
        message: `${post.title} \nMíralo en DiUna`,
      });
    } catch {}
  };

  const onDelete = async () => {
    if (deleting) return;
    Alert.alert("Eliminar publicación", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
             router.back();
            await deletePost({ postId: post._id });
           
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x || 0;
    const index = Math.round(contentOffsetX / W);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>Gestión</Text>
        <TouchableOpacity onPress={() => {}} style={styles.headerBtn}>
          <Feather name="more-horizontal" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.carouselWrap}>
          <FlatList
            data={galleryData}
            keyExtractor={(uri, idx) => `${uri}-${idx}`}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={1} onPress={() => setIsVisible(true)}>
                <Image
                  source={{ uri: item }}
                  style={styles.heroImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={[styles.heroImage, styles.heroPlaceholder]}>
                <Feather name="image" size={32} color="#9CA3AF" />
                <Text style={{ color: "#9CA3AF", marginTop: 6 }}>Sin imagen</Text>
              </View>
            }
          />

          {total > 0 && (
            <View style={styles.imageIndicator}>
              <Text style={styles.imageIndicatorText}>
                {Math.min(currentIndex + 1, total)} / {total}
              </Text>
            </View>
          )}
        </View>

        {/* Título */}
        <View style={styles.titleWrap}>
          <Text numberOfLines={2} style={styles.title}>
            {post.title}
          </Text>
        </View>

        {/* Precio y ubicación */}
        <View style={styles.metaRow}>
          <Text style={styles.price}>{formatPrice(post.price, post.currency)}</Text>
          <View style={styles.dot} />
          <Text numberOfLines={1} style={styles.locationText}>
            {post.location || "Sin ubicación"}
          </Text>
        </View>

        {/* Acciones */}
       {/* CTA Boost */}
        <View style={styles.boostWrap}>
          <TouchableOpacity style={styles.boostBtn} activeOpacity={0.9} onPress={() => {router.push("/working/working")}}>
            <Feather name="zap" size={18} color="#fff" />
            <Text style={styles.boostLabel}>Impulsar publicación</Text>
            <Feather name="chevron-right" size={18} color="#fff" />
        </TouchableOpacity>
        </View>

{/* Acciones en grilla 2x2 */}
<View style={styles.actionsGrid}>
  <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: "/general/EditProduct/[editProductId]",
        params: { editProductId: post._id },
      })
    }
    style={[styles.actionTile, { marginRight: 10 }]}
    activeOpacity={0.85}
  >
    <Feather name="edit-3" size={18} color="#111827" />
    <Text style={styles.actionTileLabel}>Editar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
                    if (post) {
                      markAsSold({ postId: post._id });
                      router.back();
                    }
                  }}
    style={styles.actionTile}
    activeOpacity={0.85}
  >
    <Feather name="check-circle" size={18} color="#111827" />
    <Text style={styles.actionTileLabel}>{post.sold ? "Vendido" : "Marcar vendido"}</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={onShare}
    style={[styles.actionTile, { marginRight: 10, marginTop: 10 }]}
    activeOpacity={0.85}
  >
    <Feather name="share-2" size={18} color="#111827" />
    <Text style={styles.actionTileLabel}>Compartir</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={onDelete}
    style={[styles.actionTile, { marginTop: 10 }]}
    activeOpacity={0.85}
  >
    <Feather name="trash-2" size={18} color="#DC2626" />
    <Text style={[styles.actionTileLabel, { color: "#DC2626" }]}>Eliminar</Text>
  </TouchableOpacity>
</View>

{/* Estadísticas */}
    <View style={styles.line} />
  <View style={styles.metricsHeader}>
    <Feather name="bar-chart-2" size={16} color="#111827" />
    <Text style={styles.metricsTitle}>Estadísticas</Text>
  </View>
  <View style={styles.metricsColumn}>
    <View style={styles.metricItem}>
      <Feather name="eye" size={16} color="#111827" />
      <Text style={styles.metricValue}>{toInt(post.views)}</Text>
      <Text style={styles.metricLabel}>Clics</Text>
    </View>
    <View style={styles.metricItem}>
      <Feather name="heart" size={16} color="#111827" />
      <Text style={styles.metricValue}>{toInt(post.numBookmarks)}</Text>
      <Text style={styles.metricLabel}>Favoritos</Text>
    </View>
    <View style={styles.metricItem}>
      <Feather name="share-2" size={16} color="#111827" />
      <Text style={styles.metricValue}>{toInt(post.shares)}</Text>
      <Text style={styles.metricLabel}>Compartidos</Text>
    </View>
  </View>



      </ScrollView>

      {/* Modal visor */}
      <ImageView
        images={imagesForModal}                          // <--- OBJETOS { uri }
        imageIndex={Math.min(currentIndex, Math.max(0, total - 1))}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
}

/* ------- utils/estilos ------- */

function toInt(x: any): number {
  const n = Number(x);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

function formatMoney(n: number, currency: string) {
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `${currency} ${Math.round(n || 0)}`;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: 50 },
    line: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  carouselWrap: { position: "relative" },                 // <--- para overlay del indicador
  /* --- CTA Boost --- */
boostWrap: {
  paddingHorizontal: 12,
  paddingTop: 8,
},
boostBtn: {
  height: 48,
  borderRadius: 14,
  backgroundColor: "#adc92b", // indigo
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 14,
  // sombra
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
},
boostLabel: {
  color: "#fff",
  fontSize: 14,
  fontFamily: "SemiBold",
},

/* --- Acciones 2x2 --- */
actionsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: 12,
  paddingTop: 10,
},
actionTile: {
  width: "48%",              // 2 por fila
  height: 48,
  borderRadius: 12,
  backgroundColor: "#F3F4F6",
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},
actionTileLabel: {
  marginLeft: 8,
  fontSize: 13,
  fontFamily: "SemiBold",
  color: "#111827",
},

/* --- Estadísticas --- */
metricsCard: {
  margin: 12,
  backgroundColor: "#FFFFFF",
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.06)",
  padding: 14,
},
metricsHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},
metricsTitle: {
  marginLeft: 8,
  fontSize: 16,
  fontWeight: "800",
  color: "#111827",
},
metricsRow: {
  flexDirection: "row",
  alignItems: "stretch",
},
metricBox: {
  flex: 1,
  backgroundColor: "#F9FAFB",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
  paddingVertical: 14,
  alignItems: "center",
  justifyContent: "center",
},
metricsColumn: {
  flexDirection: "column",
  justifyContent: "space-around",
},

metricItem: {
  flexDirection: "row",       // icono + texto en línea
  alignItems: "center",
  marginBottom: 10,
},

metricValue: {
  marginLeft: 8,
  fontSize: 18,
  fontWeight: "900",
  color: "#111827",
},

metricLabel: {
  marginLeft: 6,
  fontSize: 14,
  color: "#6B7280",
  fontWeight: "600",
},



  heroImage: {
    width: W,
    height: 200,
    backgroundColor: "#F3F4F6",
  },
  imageIndicator: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 10,
  },
  imageIndicatorText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  titleWrap: {
    
    paddingTop: 12,
    paddingBottom: 5,
    alignItems: "center",
  
  },
  title: {
    fontSize: 20,
    fontFamily: "SemiBold",
    color: "#111827",
    textAlign: "center",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
  },
  price: {
    fontSize: 15,
    fontFamily: "SemiBold",
    color: "#6B7280",
    marginRight: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2.5,
    backgroundColor: "#6B7280",
    marginHorizontal: 6,
  },
  locationText: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "Medium",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginRight: 10,
  },
  actionIcon: { width: 22, alignItems: "center" },
  actionLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
  },

  insightsCard: {
    margin: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    padding: 14,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },
  insightsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  insightTile: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  insightValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  skeletonLine: {
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 10,
  },
});
