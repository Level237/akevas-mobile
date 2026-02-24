import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../types';
import ProductCard from './ProductCard';

type Props = {
    products: Product[];
    onRefresh?: () => void;
    onAddToCart?: (product: Product) => void;
    onProductPress?: (product: Product) => void;
};

const ProductGrid = ({ products, onRefresh, onAddToCart, onProductPress }: Props) => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        if (onRefresh) {
            onRefresh();
        }
        // Mock delay for UX
        setTimeout(() => setRefreshing(false), 1500);
    }, [onRefresh]);

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
                <ProductCard
                    product={item}
                    onAddToCart={onAddToCart}
                    onPress={onProductPress}
                />
            )}
            contentContainerStyle={[styles.listContent, { paddingTop: insets.top }]}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}

            // Optimization
            initialNumToRender={6}
            windowSize={5}
            maxToRenderPerBatch={6}

            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#E67E22']}
                    tintColor="#E67E22"
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default ProductGrid;
