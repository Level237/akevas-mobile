import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryChips from '../components/CategoryChips';
import ExploreHeader from '../components/ExploreHeader';
import ExploreProductCard from '../components/ExploreProductCard';
import { Category, ExploreProduct } from '../types';
const CATEGORIES: Category[] = [
    { id: '1', label: 'Tout' },
    { id: '2', label: 'Mode' },
    { id: '3', label: 'Tech' },
    { id: '4', label: 'Maison' },
    { id: '5', label: 'Sport' },
    { id: '6', label: 'Beauté' },
];

const MOCK_PRODUCTS: ExploreProduct[] = [
    { id: '1', title: 'Montre Luxe Akevas', price: 55000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '2', title: 'Sac à main Cuir', price: 35000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: true },
    { id: '3', title: 'Chaussures Sport', price: 25000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '4', title: 'Casque Sans-fil', price: 45000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '5', title: 'Veste Élégante', price: 65000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
    { id: '6', title: 'Lunettes Soleil', price: 15000, imageUrl: require('@/assets/images/shop1.webp'), isFavorite: false },
];

const ExploreScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedCategoryId, setSelectedCategoryId] = useState('1');
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [loading, setLoading] = useState(false);

    const handleBack = () => router.back();

    const handleToggleFavorite = (id: string) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ));
    };

    const handleProductPress = (product: ExploreProduct) => {
        // En "Push" (nouvelle page par-dessus)
        router.push({
            pathname: '/(navigation)/category',
            params: { title: product.title }
        });
    };

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <CategoryChips
                categories={CATEGORIES}
                selectedId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
            />
        </View>
    );

    const renderFooter = () => {
        if (!loading) return <View style={{ height: 40 }} />;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator color="#E67E22" />
            </View>
        );
    };

    const handleLoadMore = () => {
        if (loading) return;
        setLoading(true);
        // Simulate infinite scroll loading
        setTimeout(() => {
            const moreProducts = MOCK_PRODUCTS.map(p => ({ ...p, id: `${p.id}-${Date.now()}` }));
            setProducts(prev => [...prev, ...moreProducts]);
            setLoading(false);
        }, 1500);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.safeArea}>
                <ExploreHeader onBack={handleBack} />
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <ExploreProductCard
                            product={item}
                            onPress={handleProductPress}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}
                    stickyHeaderIndices={[0]} // Pas possible de sticky CategoryChips si c'est part du ListHeaderComponent avec numColumns
                // Mais on peut envelopper ExploreHeader et CategoryChips dans un conteneur fixe en dehors de FlatList pour un vrai sticky
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    safeArea: {
        flex: 1,
    },
    listHeader: {
        backgroundColor: '#FFF',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default ExploreScreen;
