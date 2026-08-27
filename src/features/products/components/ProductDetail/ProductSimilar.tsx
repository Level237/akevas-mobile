import { COLORS } from '@/constants/colors';
import { normalizeProduct } from '@/lib/normalizeProduct';
import { useGetSimilarProductsQuery } from '@/services/guardService';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    productId?: number;
};

const ProductSimilar = ({ productId }: Props) => {
    const { data, isLoading } = useGetSimilarProductsQuery(productId, { skip: !productId });
    const router = useRouter();

    const products = useMemo(() => {
        const list = data?.data || data || [];
        return (Array.isArray(list) ? list : []).map(normalizeProduct).slice(0, 10);
    }, [data]);

    const { width } = Dimensions.get('window');
    const CARD_WIDTH = Math.round(width * 0.5);
    const GAP = 12;

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.card, { width: CARD_WIDTH }]}
            onPress={() => router.push(`/product/${item.product_url}`)}
            activeOpacity={0.8}
        >
            <View style={styles.imageWrapper}>
                {item.product_profile ? (
                    <Image source={{ uri: item.product_profile }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]} />
                )}
            </View>

            <Text numberOfLines={2} style={styles.name}>{item.product_name}</Text>

            <View style={styles.row}>
                <Text style={styles.price}>{item.product_price} FCFA</Text>
                <Text style={styles.sold}>{item.count_seller ?? 0} vend.</Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.containerLoading}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Produits similaires</Text>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + GAP}
                snapToAlignment="start"
                contentContainerStyle={[styles.listContent, { paddingHorizontal: 12 }]}
                ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 28,
    },
    listContent: {
        paddingBottom: 4,
    },
    column: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    card: {
        width: '30%',
        marginTop: 2,

        backgroundColor: '#FFF',
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#F3F4F6',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        backgroundColor: '#E5E7EB',
    },
    name: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        color: '#ed7e0f',
        fontWeight: '700',
    },
    sold: {
        color: '#6B7280',
        fontSize: 12,
    },
    containerLoading: {
        paddingVertical: 12,
        alignItems: 'center',
    },
});

export default React.memo(ProductSimilar);
