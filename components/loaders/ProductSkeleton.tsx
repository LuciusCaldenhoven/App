// components/ProductSkeleton.tsx
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';

const ProductSkeleton = () => {
    return (
        <View style={{ width: 180, height: 280, marginRight: 12 }}>
            <ContentLoader
                speed={1}
                width={180}
                height={280}
                viewBox="0 0 180 280"
                backgroundColor="#e0e0e0"
                foregroundColor="#f5f5f5"
            >
                <Rect x="0" y="0" rx="8" ry="8" width="180" height="190" />
                <Rect x="0" y="200" rx="4" ry="4" width="140" height="10" />
                <Rect x="0" y="220" rx="4" ry="4" width="100" height="10" />
            </ContentLoader>
        </View>
    );
};

export default ProductSkeleton;
