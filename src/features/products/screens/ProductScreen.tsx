import HeaderTabs from '@/components/common/HeaderTabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductFilter from '../components/ProductFilter';
import ProductGrid from '../components/ProductGrid';
import { PRODUCTS } from '../datas/products';

const ProductScreen = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <HeaderTabs title='Produits' />
            <ProductFilter />
            <ProductGrid
                products={PRODUCTS}
                onAddToCart={(p) => console.log('Add to cart:', p.title)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
});

export default ProductScreen;
