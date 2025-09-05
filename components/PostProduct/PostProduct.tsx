import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Doc } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type PostProps = { post: Doc<"posts"> };

export default function PostProduct({ post }: PostProps) {
  const imageUrl = useQuery(api.posts.getImageUrl, { storageId: post.storageId });

  const go = () =>
    router.push({
      pathname: "/general/My_products/prevista",
      params: { postId: post._id },
    });

  const isSold = !!post.sold;

  return (
    <Pressable
      onPress={go}
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      style={({ pressed }) => [s.row, pressed && s.pressed]}
    >
      {/* Miniatura */}
      <View style={s.thumbWrap}>
        <Image
          source={{ uri: imageUrl }}
          style={s.thumb}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </View>

      {/* Contenido */}
      <View style={s.content}>
        {/* Precio */}
        <Text style={[s.price, isSold && s.priceMuted]}>
          {isFiniteNumber(post.price) ? formatPrice(post.price as any, post.currency || "PEN") : "—"}
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

/* ---------- estilos ---------- */

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
  },
  thumb: { width: "100%", height: "100%" },

  content: { flex: 1, minWidth: 0, justifyContent: "center" },

  price: {
    fontSize: 15,
    fontFamily: "Bold",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  priceMuted: {
    color: "#6B7280", // si está vendido, bajamos el énfasis del precio
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
  available: { color: "#059669" }, // verde
  sold: { color: "#DC2626" }, // rojo

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
