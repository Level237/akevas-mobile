import { Product } from '@/types/product';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 15) / 2;

type Props = {
    product: Product;
    onPress?: (product: Product) => void;
};

const ProductCard = ({ product, onPress }: Props) => {

    const getColorSwatches = useCallback((product: any) => {
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
    }, []);
    const router = useRouter()
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push({
                pathname: "/product/[url]",
                params: { url: product.product_url }
            })}
            activeOpacity={0.9}
        >
            <View>
                <Image
                    source={{ uri: product.product_profile }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
                {getColorSwatches(product).length > 0 && (
                    <View style={styles.swatchesContainer}>
                        {getColorSwatches(product).map((color, index) => (
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
        width: CARD_WIDTH,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#F0F0F0',
    },
    swatchesContainer: {
        position: 'absolute',
        bottom: 6,
        right: 50,
        transform: [{ translateX: -0.5 }],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.68)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 10,
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
    content: {
        padding: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E67E22',
    },
});

export default memo(ProductCard);
