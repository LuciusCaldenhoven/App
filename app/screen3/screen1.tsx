

import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
  {
    id: '1',
    title: 'Ropa',
    icon: require('@/assets/index/ropa.png'),
    bgColor: '#E6F4EA',
  },
  {
    id: '2',
    title: 'Electrónica',
    icon: require('@/assets/index/electronica.png'),
    bgColor: '#E0F7FA',
  },

  {
    id: '3',
    title: 'Deportes',
    icon: require('@/assets/index/deporte.png'),
    bgColor: '#F3E5F5',
  },
];

const CategoryGrid = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - 60) / 2;

  type Category = {
    id: string;
    title: string;
    icon: any;
    bgColor: string;
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={{
        backgroundColor: item.bgColor,
        borderRadius: 16,
        padding: 16,
        width: itemSize,
        height: 160,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
      onPress={() =>
        router.push(`/search/searchResults?category=${item.title}`)
      }
    >
      <Image
        source={item.icon}
        style={{ width: 60, height: 60, marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text style={{ fontWeight: '600', fontSize: 16, color: '#333' }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CategoryGrid;
