import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  Share,
  SafeAreaView,
  ScrollView,
  Platform,
  Modal,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ImageView from "react-native-image-viewing";
import { Rocket } from "lucide-react-native";

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
  const toggleSold = useMutation(api.posts.toggleSold);

  // Estado local
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

    const withCommas = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const c = currency?.trim().toLowerCase();
    const isSoles = c === "soles" || c === "sol" || c === "s/." || c === "s/";

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

  // Abre modal custom (no Alert nativo)
  const onDelete = () => {
    if (deleting) return;
    setShowConfirm(true);
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x || 0;
    const index = Math.round(contentOffsetX / W);
    setCurrentIndex(index);
  };

  // --- helpers UI ---
  function abbreviate(n: number) {
    if (n === null || n === undefined) return "0";
    const abs = Math.abs(n);
    if (abs < 1000) return `${n}`;
    const units = ["k", "M", "B", "T"];
    let u = -1;
    let num = abs;
    while (num >= 1000 && u < units.length - 1) {
      num /= 1000;
      u++;
    }
    const sign = n < 0 ? "-" : "";
    return `${sign}${num.toFixed(num < 10 ? 1 : 0)}${units[u]}`;
  }

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
              <View style={[styles.heroImage, styles.heroPlaceholder]} />
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

        {/* CTA Boost */}
        <View style={styles.boostWrap}>
          <TouchableOpacity
            style={styles.boostBtn}
            activeOpacity={0.9}
            onPress={() => {
              router.push("/working/working");
            }}
          >
            <Rocket size={18} color="#fff" strokeWidth={2.5} />
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
                setMarking(true);
                toggleSold({ postId: post._id }).finally(() => setMarking(false));
              }
            }}
            style={styles.actionTile}
            activeOpacity={0.85}
          >
            <Feather name="check-circle" size={18} color="#111827" />
            <Text style={styles.actionTileLabel}>
              {post.sold ? (marking ? "Actualizando..." : "Vendido") : (marking ? "Marcando..." : "Marcar vendido")}
            </Text>
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
            <Text style={[styles.actionTileLabel, { color: "#DC2626" }]}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.sectionSeparator} />

        <View style={{ paddingHorizontal: 15 }}>
          {/* Header estadísticas */}
          <View style={styles.headerRow}>
            <View style={styles.headerIconWrap}>
              <Feather name="bar-chart-2" size={16} color="#111827" />
            </View>
            <Text style={styles.metricsTitle}>Estadísticas</Text>
            <View style={styles.periodChip}>
              <Text style={styles.periodText}>Todo el tiempo</Text>
            </View>
          </View>

          {/* Card métricas */}
          <View style={styles.card}>
            {/* Item 1 */}
            <View>
              <View style={styles.metricRow}>
                <View style={[styles.iconBadge, styles.iconBadgeLight]}>
                  <Feather name="eye" size={16} color="#111827" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.metricValueNew}>{abbreviate(toInt(post.views))}</Text>
                  <Text style={styles.metricLabelNew}>Clics en el anuncio</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </View>

            {/* Item 2 */}
            <View>
              <View style={styles.metricRow}>
                <View style={[styles.iconBadge, styles.iconBadgeLight]}>
                  <Feather name="heart" size={16} color="#111827" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.metricValueNew}>{abbreviate(toInt(post.numBookmarks))}</Text>
                  <Text style={styles.metricLabelNew}>Guardados del anuncio</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </View>

            {/* Item 3 */}
            <View>
              <View style={styles.metricRow}>
                <View style={[styles.iconBadge, styles.iconBadgeLight]}>
                  <Feather name="share-2" size={16} color="#111827" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.metricValueNew}>{abbreviate(toInt(post.numShares))}</Text>
                  <Text style={styles.metricLabelNew}>Compartidos del anuncio</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal visor */}
      <ImageView
        images={imagesForModal}
        imageIndex={Math.min(currentIndex, Math.max(0, total - 1))}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />

      {/* Modal de confirmación custom */}
      <ConfirmDialog
        visible={showConfirm}
        title="Eliminar publicación"
        message="Esta acción no se puede deshacer. ¿Deseas eliminar este anuncio?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        onCancel={() => setShowConfirm(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            setShowConfirm(false);
            router.back();
            await deletePost({ postId: post._id });
          } finally {
            setDeleting(false);
          }
        }}
      />
    </View>
  );
}

/* ------- utils/estilos ------- */

function toInt(x: any): number {
  const n = Number(x);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: 50 },

  sectionSeparator: {
    height: 8,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
    marginTop: 8,
  },

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
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#FFFFFF",
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
    fontSize: 18,
    fontFamily: "SemiBold",
    color: "#111827",
  },

  carouselWrap: { position: "relative" },
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

  /* --- CTA Boost --- */
  boostWrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  boostBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#adc92b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
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
    width: "48%",
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

  /* --- Header de estadísticas --- */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  metricsTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontFamily: "SemiBold",
    color: "#111827",
  },
  periodChip: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  periodText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Medium",
  },

  /* --- Card & filas de métricas --- */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    paddingVertical: 6,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 1.5 },
    }),
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
  },
  iconBadgeLight: {
    backgroundColor: "#F9FAFB",
    borderColor: "rgba(0,0,0,0.05)",
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  metricValueNew: {
    fontSize: 20,
    fontFamily: "SemiBold",
    color: "#111827",
    lineHeight: 24,
  },
  metricLabelNew: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginLeft: 54,
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
    fontFamily: "SemiBold",
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

/* ===========================
   ConfirmDialog (custom UI)
=========================== */
function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  loading = false,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const scale = React.useRef(new Animated.Value(0.9)).current;
  const fade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
        Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[confirmStyles.backdrop, { opacity: fade }]} />
      {/* Cerrar tocando fuera */}
      <View style={confirmStyles.centerWrap} pointerEvents="box-none">
        <Pressable style={confirmStyles.touchFill} onPress={onCancel} />
        {/* Card */}
        <Animated.View style={[confirmStyles.card, { transform: [{ scale }] }]}>
          <View style={confirmStyles.headerRow}>
            <View style={confirmStyles.iconWarn}>
              <Feather name="alert-triangle" size={18} color="#DC2626" />
            </View>
            <Text style={confirmStyles.title}>{title}</Text>
          </View>

          {message ? <Text style={confirmStyles.message}>{message}</Text> : null}

          <View style={confirmStyles.actionsRow}>
            <TouchableOpacity
              style={[confirmStyles.btn, confirmStyles.btnGhost]}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={[confirmStyles.btnGhostText]}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[confirmStyles.btn, confirmStyles.btnDanger]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather name="trash-2" size={16} color="#fff" />
                  <Text style={confirmStyles.btnDangerText}> {confirmText}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const confirmStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  touchFill: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 4 },
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  iconWarn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(220,38,38,0.1)",
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "SemiBold",
    color: "#111827",
    flexShrink: 1,
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  btn: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  btnGhost: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(0,0,0,0.08)",
    marginRight: 10,
  },
  btnGhostText: {
    color: "#111827",
    fontFamily: "SemiBold",
    fontSize: 14,
  },
  btnDanger: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
    minWidth: 120,
  },
  btnDangerText: {
    color: "#FFFFFF",
    fontFamily: "SemiBold",
    fontSize: 14,
  },
});
