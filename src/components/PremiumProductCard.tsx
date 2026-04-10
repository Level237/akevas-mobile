import { Product } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    product: Product;
};

const PremiumProductCard = ({ product }: Props) => {
    const router = useRouter();

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

export default memo(PremiumProductCard);
