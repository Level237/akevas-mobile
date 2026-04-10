import PremiumProductCard from '@/components/PremiumProductCard';
import { useGetHomeProductsQuery } from '@/services/guardService';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PremiumProductsCarousel = () => {
    // According to mock/standard API it probably returns data property
    const { data: responseData, isLoading } = useGetHomeProductsQuery(undefined);

    // Extract products safely depending on actual backend response shape
    // Assuming `{ data: [...] }` since many of your queries map this way
    const products = responseData?.data || [];

    const renderItem = useCallback(({ item }: any) => <PremiumProductCard product={item} />, []);

    const keyExtractor = useCallback((item: any) => item.id?.toString() || Math.random().toString(), []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#E67E22" />
            </View>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Produits Premium</Text>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews={true}
                // getItemLayout adds significant performance optimization for fixed width items
                getItemLayout={(_, index) => ({
                    length: 166, // 150 width + 16 marginRight
                    offset: 166 * index,
                    index,
                })}
            />

            <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerText}>Voir toutes les produits</Text>
                <Ionicons name="chevron-forward" size={16} color="#374151" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 16,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContent: {
        paddingLeft: 20,
        paddingRight: 4, // Leaves 16px via the last item's marginRight
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 4,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
});

export default memo(PremiumProductsCarousel);
