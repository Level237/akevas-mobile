import ProductDetailScreen from '@/features/products/screens/ProductDetailScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const ProductDetailRoute = () => {
    const { url } = useLocalSearchParams<{ url: string }>();

    if (!url) return null;

    return <ProductDetailScreen url={url} />;
};

export default ProductDetailRoute;
