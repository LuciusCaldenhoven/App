// components/CategorySelect/CategorySelect.UI.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DATA from "@/assets/categoria/all";
import { CATEGORY_ICON_BY_SLUG, slugify } from "@/assets/categoria/iconMap";

const APP_PRIMARY = "#adc92b";

type Leaf = null | string;
interface CategoryNodeObj { [key: string]: CategoryNode }
type CategoryNode = Leaf | string[] | CategoryNodeObj | (string | CategoryNodeObj)[];

export type CategorySelectProps = {
  label: string;
  valueCategory: string;
  onChangeTextCategory: (value: string) => void;
  valueSub: string;
  onChangeTextSub: (value: string) => void;
  iconComponent?: JSX.Element;
  onFocus?: () => void;
  duration?: number;
  tree?: Record<string, CategoryNode>;
  delimiter?: string;
  onChangePath?: (path: string[]) => void;
};

type Item = { key: string; hasChildren: boolean; path: string[] };

// utilities
function getNodeByPath(root: Record<string, CategoryNode>, path: string[]): CategoryNode {
  let node: any = root;
  for (const segment of path) {
    if (node == null) return null;
    if (Array.isArray(node)) {
      const entry = node.find(
        (e) => typeof e === "object" && e !== null && Object.prototype.hasOwnProperty.call(e, segment)
      );
      node = entry ? (entry as Record<string, CategoryNode>)[segment] : null;
    } else if (typeof node === "object") {
      node = (node as Record<string, CategoryNode>)[segment] ?? null;
    } else return null;
  }
  return node as CategoryNode;
}

function getChildren(node: CategoryNode, path: string[]): Item[] {
  if (!node) return [];
  const items: Item[] = [];
  if (Array.isArray(node)) {
    node.forEach((entry) => {
      if (typeof entry === "string") items.push({ key: entry, hasChildren: false, path: [...path, entry] });
      else if (entry && typeof entry === "object") {
        Object.entries(entry).forEach(([name, child]) => items.push({ key: name, hasChildren: !!child, path: [...path, name] }));
      }
    });
  } else if (typeof node === "object") {
    Object.entries(node).forEach(([name, child]) => items.push({ key: name, hasChildren: !!child, path: [...path, name] }));
  }
  return items;
}

function isLeaf(node: CategoryNode): boolean {
  return node == null || typeof node === "string";
}

export default function CategorySelect({
  label,
  valueCategory,
  onChangeTextCategory,
  valueSub,
  onChangeTextSub,
  iconComponent,
  onFocus,
  duration = 240,
  tree,
  delimiter = " > ",
  onChangePath,
}: CategorySelectProps) {
  // === ANIMATED UI ===
  const anim = useRef(new Animated.Value(valueCategory || valueSub ? 1 : 0)).current;
  const focused = useRef(false);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: valueCategory || valueSub ? 1 : 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [valueCategory, valueSub]);

  // === LOGICA ===
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedPath, setSelectedPath] = useState<string[] | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const ROOT = useMemo(() => (tree ?? (DATA as Record<string, CategoryNode>)), [tree]);
  const currentNode = useMemo(() => (currentPath.length === 0 ? ROOT : getNodeByPath(ROOT, currentPath)), [ROOT, currentPath]);
  const items = useMemo<Item[]>(() => (currentPath.length === 0 ? Object.keys(ROOT).map(k => ({ key: k, hasChildren: !!ROOT[k], path: [k] })) : getChildren(currentNode, currentPath)), [ROOT, currentNode, currentPath]);

  const handleFocus = () => {
    focused.current = true;
    Animated.timing(anim, { toValue: 1, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    bottomSheetModalRef.current?.present();
    onFocus?.();
  };

  const selectLeaf = (path: string[]) => {
    const category = path[0] ?? "";
    const sub = path[path.length - 1] ?? "";
    setSelectedPath(path);
    onChangeTextCategory(category);
    onChangeTextSub(sub);
    onChangePath?.(path);
    bottomSheetModalRef.current?.dismiss();
  };

  const onPressItem = (item: Item) => {
    const node = getNodeByPath(ROOT, item.path);
    if (isLeaf(node)) selectLeaf(item.path);
    else setCurrentPath(item.path);
  };
  const goBack = () => setCurrentPath(p => p.slice(0, -1));

  const displayText = useMemo(() => {
    const parts = [valueCategory, valueSub].filter(Boolean);
    if (!parts.length && selectedPath?.length) return selectedPath.join(delimiter);
    return parts.join(delimiter);
  }, [valueCategory, valueSub, selectedPath]);

  // === ANIMATED UI ===
  const labelStyle = {
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [6, -18] }) },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.88] }) },
    ],
    color: APP_PRIMARY,
    left: 6,
  };
  const underlineWidth = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={styles.inputWrap}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>

      <Pressable onPress={handleFocus}>
        <Text style={[styles.textInput, { color: displayText ? "#111" : "rgba(0,0,0,0.25)" }]} numberOfLines={1}>
          {displayText }
        </Text>
      </Pressable>

      <View style={styles.underlineBg} />
      <Animated.View style={[styles.underlineFill, { transform: [{ scaleX: underlineWidth }], backgroundColor: APP_PRIMARY }]} />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["85%"]}
        enableDynamicSizing={false}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} pressBehavior="close" />}
      >
        <BottomSheetScrollView style={styles.bottomSheet} contentContainerStyle={{ paddingBottom: 40 }}>
          {currentPath.length > 0 && (
            <>
              <Pressable onPress={goBack} style={styles.backRow}>
                <Text style={styles.headerBackArrow}>←</Text>
                <Text style={styles.headerTitle}>{currentPath[currentPath.length - 1]}</Text>
              </Pressable>
            </>
          )}
          {items.map(item => {
            const isRoot = currentPath.length === 0;
            const iconSrc = isRoot ? CATEGORY_ICON_BY_SLUG[slugify(item.key)] : undefined;
            return (
              <Pressable key={item.path.join("///")} onPress={() => onPressItem(item)} style={styles.itemContainer}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  {isRoot && iconSrc && <Image source={iconSrc} style={styles.icon} />}
                  <Text style={styles.bottomInfo}>{item.key}</Text>
                </View>
                <Text style={styles.rowChevron}>{item.hasChildren ? "›" : ""}</Text>
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: { marginVertical: 6, width: "100%" },
  label: { position: "absolute", fontFamily: "Medium", fontSize: 14, top: 12 },
  textInput: { fontFamily: "Medium", fontSize: 14, paddingVertical: 14, paddingHorizontal: 6 },
  underlineBg: { height: 2, backgroundColor: "#E5E7EB" },
  underlineFill: { height: 2, backgroundColor: APP_PRIMARY, position: "absolute", bottom: 0, left: 0 },
  bottomSheet: { backgroundColor: "#fff", flex: 0.8 },
  backRow: { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  headerBackArrow: { fontSize: 20, color: "#111" },
  headerTitle: { fontFamily: "SemiBold", fontSize: 16, color: "#111" },
  itemContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 12 },
  bottomInfo: { fontFamily: "Medium", fontSize: 14, color: "#111827" },
  rowChevron: { fontSize: 18, color: "rgba(0,0,0,0.5)", fontWeight: "600" },
  icon: { width: 36, height: 36 },
});
