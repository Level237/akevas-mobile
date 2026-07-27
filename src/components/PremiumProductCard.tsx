import { Product } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    product: Product;
};

const PremiumProductCard = ({ product }: Props) => {
    const router = useRouter();

    const swatches = useMemo(() => {
        if (!product.variations?.length) return [];
        const seen = new Set();
        const colors = [];
        for (const variation of product.variations) {
            if (variation.color?.hex && !seen.has(variation.color.hex)) {
                colors.push({
                    name: variation.color.name,
                    hex: variation.color.hex,
                });
                seen.add(variation.color.hex);
            }
            if (colors.length === 4) break;
        }
        return colors;
    }, [product.variations]);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push({
                pathname: "/product/[url]",
                params: { url: product.product_url }
            })}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.product_profile }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
                <View style={styles.ratingBadge}>
                    <Ionicons name="star-outline" size={12} color="#FBBF24" style={styles.starIcon} />
                    <Text style={styles.ratingText}>{product.review_average || '0'}</Text>
                </View>

                {swatches.length > 0 && (
                    <View style={styles.swatchesContainer}>
                        {swatches.map((color, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.swatch,
                                    { backgroundColor: color.hex },
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {product.product_name}
                </Text>
                <Text style={styles.price}>{product.product_price} FCFA</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginRight: 16,
        overflow: 'hidden',
        // Soft shadow from design
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#F8F9FA',
    },
    image: {
        width: '100%',
        height: 150,
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4, // Adds space between icon and text
    },
    swatchesContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    swatch: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    starIcon: {},
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
    },
    content: {
        padding: 12,
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E67E22', // Orange
    },
});

export default memo(PremiumProductCard, (prevProps, nextProps) => {
    // Ensures the card only re-renders if the actual product ID or variations length changes.
    // Extremely performant for large lists where object references might change.
    return prevProps.product.id === nextProps.product.id && 
           prevProps.product.variations?.length === nextProps.product.variations?.length;
});
