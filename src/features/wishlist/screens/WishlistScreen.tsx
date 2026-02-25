import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import EmptyWishlist from '../components/EmptyWishlist';
import HeaderWishlist from '../components/HeaderWishlist';
import RecommendationItem from '../components/RecommendationItem';
import WishlistGrid from '../components/WishlistGrid';
import { RecommendationItemType, WishlistItemType } from '../types';

const MOCK_WISH_ITEMS: WishlistItemType[] = [
    {
        id: '1',
        title: 'Montre Luxe Akevas',
        price: 55000,
        imageUrl: require('@/assets/images/shop1.webp'),
    },
    {
        id: '2',
        title: 'Sac de sport Premium',
        price: 32000,
        imageUrl: require('@/assets/images/shop1.webp'),
    },
];

const MOCK_RECOMMENDATIONS: RecommendationItemType[] = [
    { id: 'r1', title: 'Chaussures Sport', price: 25000, imageUrl: require('@/assets/images/shop1.webp') },
    { id: 'r2', title: 'Casque Pro', price: 45000, imageUrl: require('@/assets/images/shop1.webp') },
    { id: 'r3', title: 'Lunettes Elite', price: 18000, imageUrl: require('@/assets/images/shop1.webp') },
    { id: 'r4', title: 'Veste Style', price: 35000, imageUrl: require('@/assets/images/shop1.webp') },
];


const WishlistScreen = () => {
    const router = useRouter();
    const [items, setItems] = useState<WishlistItemType[]>(MOCK_WISH_ITEMS);
    const [recommendations] = useState<RecommendationItemType[]>(MOCK_RECOMMENDATIONS);

    const isEmpty = items.length === 0;
    const showRecommendations = isEmpty || items.length <= 3;

    const handleRemove = (id: string) => {
        setItems(curr => curr.filter(item => item.id !== id));
    };

    const handleAddToCart = (item: any) => {
        console.log('Added to cart:', item.title);
    };

    const handleToggleFavorite = (item: RecommendationItemType) => {
        setItems(curr => [...curr, { ...item, id: `fav-${item.id}` }]);
    };

    const handleProductPress = (product: any) => {
        router.push({
            pathname: '/(navigation)/category',
            params: { title: product.title }
        });
    };

    const renderFooter = () => {
        if (!showRecommendations) return null;
        return (
            <View style={styles.recommendationBox}>
                <Text style={styles.recommendationTitle}>Vous aimerez aussi</Text>
                <FlatList
                    horizontal
                    data={recommendations}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recommendationList}
                    renderItem={({ item }) => (
                        <RecommendationItem
                            item={item}
                            onAddToCart={handleAddToCart}
                            onFavorite={handleToggleFavorite}
                            onPress={() => { }}
                        />
                    )}
                />
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <HeaderWishlist itemsLength={items.length} />

            {isEmpty ? (
                // Si vide, on peut garder un ScrollView simple ou une FlatList vide
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <EmptyWishlist />
                    {renderFooter()}
                </ScrollView>
            ) : (
                // ✅ LA SOLUTION : On utilise uniquement WishlistGrid
                <WishlistGrid
                    items={items}
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                    ListFooterComponent={renderFooter()} // On injecte les reco ici
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    itemCount: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 16,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    gridContainer: {
        minHeight: 300,
    },
    recommendationBox: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 8,
        borderTopColor: '#F9F9F9',
    },
    recommendationTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginLeft: 16,
        marginBottom: 16,
    },
    recommendationList: {
        paddingLeft: 16,
        paddingRight: 8,
    },
});

export default WishlistScreen;
