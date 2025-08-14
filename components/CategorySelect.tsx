// CategorySelect.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Keyboard, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { scale } from '@/constants/scale';
import DATA from '@/assets/categoria/all';
import { CATEGORY_ICON_BY_SLUG, slugify } from '@/assets/categoria/iconMap';

// Tipos de árbol
type Leaf = null | string;
interface CategoryNodeObj { [key: string]: CategoryNode }
type CategoryNode =
  | Leaf
  | string[]
  | CategoryNodeObj
  | (string | CategoryNodeObj)[];

interface CategorySelectProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  iconComponent?: JSX.Element;
  onFocus?: () => void;
  duration?: number;
  tree?: Record<string, CategoryNode>;
  delimiter?: string;
  onChangePath?: (path: string[]) => void;
}

// Helpers
type Item = { key: string; hasChildren: boolean; path: string[] };

function getNodeByPath(root: Record<string, CategoryNode>, path: string[]): CategoryNode {
  let node: any = root;
  for (const segment of path) {
    if (node == null) return null;
    if (Array.isArray(node)) {
      const entry = node.find(
        (e) => typeof e === 'object' && e !== null && Object.prototype.hasOwnProperty.call(e, segment)
      );
      node = entry ? (entry as Record<string, CategoryNode>)[segment] : null;
    } else if (typeof node === 'object') {
      node = (node as Record<string, CategoryNode>)[segment] ?? null;
    } else {
      return null;
    }
  }
  return node as CategoryNode;
}

function getChildren(node: CategoryNode, path: string[]): Item[] {
  if (!node) return [];
  const items: Item[] = [];

  if (Array.isArray(node)) {
    node.forEach((entry) => {
      if (typeof entry === 'string') {
        items.push({ key: entry, hasChildren: false, path: [...path, entry] });
      } else if (entry && typeof entry === 'object') {
        Object.entries(entry).forEach(([name, child]) => {
          items.push({ key: name, hasChildren: !!child, path: [...path, name] });
        });
      }
    });
  } else if (typeof node === 'object') {
    Object.entries(node).forEach(([name, child]) => {
      items.push({ key: name, hasChildren: !!child, path: [...path, name] });
    });
  }
  // sin sort → respeta el orden original
  return items;
}

function isLeaf(node: CategoryNode): boolean {
  return node == null || typeof node === 'string';
}

function joinPath(path: string[], delimiter: string) {
  return path.join(delimiter);
}

// Componente
const CategorySelect = ({
  label,
  value,
  onChangeText,
  iconComponent,
  onFocus,
  duration = 200,
  tree,
  delimiter = ' > ',
  onChangePath,
}: CategorySelectProps) => {
  const borderWidth = useRef(new Animated.Value(1.25)).current;
  const transY = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [selectedPath, setSelectedPath] = useState<string[] | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const ROOT = useMemo(() => (tree ?? (DATA as Record<string, CategoryNode>)), [tree]);

  const currentNode = useMemo(() => {
    if (currentPath.length === 0) return ROOT as unknown as CategoryNode;
    return getNodeByPath(ROOT, currentPath);
  }, [ROOT, currentPath]);

  const items = useMemo<Item[]>(() => {
    if (currentPath.length === 0) {
      return Object.keys(ROOT).map<Item>((k) => ({ key: k, hasChildren: !!ROOT[k], path: [k] }));
    }
    return getChildren(currentNode, currentPath);
  }, [ROOT, currentNode, currentPath]);

  // Animaciones
  const animateTransform = (toValue: number) => {
    Animated.timing(transY, { toValue, duration, useNativeDriver: true, easing: Easing.ease }).start();
  };
  const animateBorderWidth = (toValue: number) => {
    Animated.timing(borderWidth, { toValue, duration, useNativeDriver: false, easing: Easing.ease }).start();
  };
  const handleFocus = () => {
    animateTransform(-40);
    animateBorderWidth(2);
    onFocus?.();
  };
  const handleBlur = (currentValue: string) => {
    if (!currentValue) {
      animateTransform(0);
      animateBorderWidth(1.25);
    }
  };

  useEffect(() => {
    if (value?.trim() !== '') {
      animateTransform(-40);
      animateBorderWidth(2);
    } else {
      handleBlur('');
    }
  }, [value]);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    setCurrentPath(selectedPath ?? []);
    bottomSheetModalRef.current?.present();
  }, [selectedPath]);

  const borderColor = borderWidth.interpolate({ inputRange: [0, 2], outputRange: ['black', '#7ea437'] });
  const labelColor = borderWidth.interpolate({ inputRange: [0, 2], outputRange: ['grey', 'black'] });
  const fontSize = borderWidth.interpolate({ inputRange: [0, 2], outputRange: [14, 12] });
  const transX = transY.interpolate({ inputRange: [-40, 0], outputRange: [-10, 0] });

  // Acciones
  const selectLeaf = (path: string[]) => {
    const labelText = joinPath(path, delimiter);
    setSelectedPath(path);
    onChangeText(labelText);
    onChangePath?.(path);
    bottomSheetModalRef.current?.dismiss();
    handleBlur(labelText);
  };

  const onPressItem = (item: Item) => {
    const node = getNodeByPath(ROOT, item.path);
    if (isLeaf(node)) {
      selectLeaf(item.path);
    } else {
      setCurrentPath(item.path);
    }
  };

  const goBack = () => setCurrentPath((p) => p.slice(0, -1));

  const displayText = useMemo(() => {
    if (selectedPath && selectedPath.length) return joinPath(selectedPath, delimiter);
    return value ?? '';
  }, [selectedPath, value, delimiter]);

  // Título actual (último segmento); en raíz quedará vacío
  const headerText = currentPath.length > 0 ? currentPath[currentPath.length - 1] : '';

  return (
    <Animated.View style={[styles.container, { borderWidth, borderColor }]}>
      <Animated.View style={[styles.labelContainer, { transform: [{ translateY: transY }, { translateX: transX }] }]}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          {iconComponent}
          <Animated.Text style={{ color: labelColor, fontSize, fontFamily: 'Medium' }}>{label}</Animated.Text>
        </View>
      </Animated.View>

      <Pressable onPress={() => { handleFocus(); handlePresentModalPress(); }} style={styles.input}>
        <Text style={{ flex: 1, fontFamily: 'Medium', fontSize: 14, color: 'black' }} numberOfLines={1}>
          {displayText}
        </Text>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['85%']}
        enableDynamicSizing={false}
        onDismiss={() => { if (!selectedPath?.length && !value) handleBlur(''); }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} pressBehavior="close" />
        )}
      >
        <BottomSheetScrollView style={styles.bottomSheet} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Back dentro de la lista */}
          {currentPath.length > 0 && (
            <>
              <Pressable onPress={goBack} style={styles.backRow} hitSlop={10}>
                <Text style={styles.headerBackArrow}>←</Text>
                <Text style={styles.headerTitle} numberOfLines={1}>{headerText}</Text>
              </Pressable>
              <View style={styles.separator} />
            </>
          )}

          {items.map((item, idx) => {
            const isRoot = currentPath.length === 0;
            const iconSrc = isRoot ? CATEGORY_ICON_BY_SLUG[slugify(item.key)] : undefined;

            return (
              <View key={item.path.join('///')}>
                <Pressable onPress={() => onPressItem(item)} style={styles.itemContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {isRoot && iconSrc && (
                      <Image source={iconSrc} style={styles.icon} resizeMode="contain" />
                    )}
                    <Text style={styles.bottomInfo}>{item.key}</Text>
                  </View>
                  <Text style={styles.rowChevron}>{item.hasChildren ? '›' : ''}</Text>
                </Pressable>

                {/* Separador entre filas */}
                <View style={styles.separator} />
              </View>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </Animated.View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    paddingLeft: 10,
    top: 16,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    color: '#1A1A1A',
  },

  // Back dentro del scroll
  backRow: {
    paddingVertical: scale(14),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackArrow: {
    fontSize: 20,
    color: '#1F2937',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'SemiBold',
    fontSize: 16,
    color: 'black',
    marginLeft: 12,
  },

  // Item
  itemContainer: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomInfo: {
    fontFamily: 'Medium',
    fontSize: 14,
    color: '#111827',
  },
  rowChevron: {
    width: 18,
    textAlign: 'center',
    color: 'rgba(0,0,0,0.5)',
    fontSize: 18,
    fontWeight: '600',
  },

  // Separadores
  separator: {
    height: 1.5,
    backgroundColor: '#E5E7EB', // gris claro
    marginHorizontal: scale(12),       // opcional: indenta para no pasar por debajo del borde redondeado
  },

  bottomSheet: {
    backgroundColor: '#FFFFFF',
    flex: 0.8,
    borderRadius: scale(12),
    paddingTop: scale(4),
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default CategorySelect;
