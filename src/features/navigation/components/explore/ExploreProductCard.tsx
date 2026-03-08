import { Product } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { memo, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 43) / 2;

type Props = {
    product: Product;
    onPress?: (product: Product) => void;
    onToggleFavorite?: (id: string) => void;
};

const ExploreProductCard = ({ product, onPress, onToggleFavorite }: Props) => {

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
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => onPress?.(product)}
        >
            <View style={styles.imageContainer}>
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
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => onToggleFavorite?.(product.id)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={"heart-outline"}
                        size={20}
                        color={"#333"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                    {product.product_name}
                </Text>
                <Text style={styles.price}>
                    {product.product_price} Fcfa
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
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
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F9F9F9',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    info: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1A1A',
    },
});

export default memo(ExploreProductCard);
