import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

type PostProps = { post: Doc<"posts"> };

export default function PostFav({ post }: PostProps) {
  const [isBookmarked, setIsBookmarked] = useState(true);

  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const toggleBookmarkCount = useMutation(api.posts.toggleBookmarkCount);

  const imageUrl = useQuery(api.posts.getImageUrl, { storageId: post.storageId });

  const isSold = !!post.sold;



  const handleBookmark = async () => {
    const newIsBookmarked = await toggleBookmark({ postId: post._id });
    await toggleBookmarkCount({ postId: post._id, add: newIsBookmarked });
    setIsBookmarked(newIsBookmarked);
  };

  return (
    <Pressable
      onPress={() => router.push(`/product/${post._id}`)}
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      style={({ pressed }) => [s.row, pressed && s.pressed]}
    >
      {/* Miniatura */}
      <View style={s.thumbWrap}>
        <Image
          source={{ uri: imageUrl || undefined }}
          style={s.thumb}
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        {/* Botón favorito flotante */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleBookmark();
          }}
          style={s.favBtn}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isBookmarked ? "heart" : "heart-outline"}
            size={18}
            color={isBookmarked ? "#FF5A7A" : "#111827"}
          />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={s.content}>
        {/* Precio */}
        <Text style={[s.price, isSold && s.priceMuted]}>
          {isFiniteNumber(post.price)
            ? formatPrice(post.price as any, post.currency || "PEN")
            : "—"}
        </Text>

        {/* Título */}
        <Text numberOfLines={2} style={s.title}>
          {post.title}
        </Text>

        {/* Meta: estado + fecha (con iconos) */}
        <View style={s.metaRow}>
          <View style={s.metaItem}>
            <Feather
              name={isSold ? "x-circle" : "check-circle"}
              size={14}
              color={isSold ? "#DC2626" : "#059669"}
            />
            <Text style={[s.metaText, isSold ? s.sold : s.available]}>
              {isSold ? "Vendido" : "Disponible"}
            </Text>
          </View>

          <View style={s.dot} />

          <View style={s.metaItem}>
            <Feather name="calendar" size={14} color="#6B7280" />
            <Text style={s.metaText}>{formatDate(post._creationTime)}</Text>
          </View>
        </View>
      </View>

      {/* Divisor */}
      <View style={s.divider} />
    </Pressable>
  );
}

/* ---------- utils ---------- */

function isFiniteNumber(x: any) {
  const n = Number(x);
  return Number.isFinite(n);
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

function formatDate(timestamp: number) {
  try {
    const d = new Date(timestamp);
    return d.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* ---------- estilos (clonando la estética de PostProduct) ---------- */

const THUMB = 92;

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: "relative",
  },
  pressed: { backgroundColor: "#F9FAFB" },

  thumbWrap: {
    width: THUMB,
    height: THUMB,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.08)",
    marginRight: 12,
    position: "relative",
  },
  thumb: { width: "100%", height: "100%" },

  favBtn: {
    position: "absolute",
    right: 6,
    top: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(17,24,39,0.08)",
  },

  content: { flex: 1, minWidth: 0, justifyContent: "center" },

  price: {
    fontSize: 15,
    fontFamily: "Bold",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  priceMuted: {
    color: "#6B7280",
    textDecorationLine: "line-through",
  },

  title: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontFamily: "Medium",
    marginBottom: 8,
  },

  metaRow: { flexDirection: "row", alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Medium",
  },
  available: { color: "#059669" },
  sold: { color: "#DC2626" },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(107,114,128,0.6)",
    marginHorizontal: 10,
  },

  divider: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(17,24,39,0.08)",
  },
});
