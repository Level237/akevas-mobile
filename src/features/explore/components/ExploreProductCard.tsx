import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { memo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExploreProduct } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 43) / 2;

type Props = {
    product: ExploreProduct;
    onPress?: (product: ExploreProduct) => void;
    onToggleFavorite?: (id: string) => void;
};

const ExploreProductCard = ({ product, onPress, onToggleFavorite }: Props) => {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => onPress?.(product)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={product.imageUrl}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => onToggleFavorite?.(product.id)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={product.isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={product.isFavorite ? "#E74C3C" : "#333"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                    {product.title}
                </Text>
                <Text style={styles.price}>
                    {product.price.toLocaleString()} Fcfa
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
