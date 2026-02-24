import { Image } from 'expo-image';
import React, { memo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 43) / 2 // (width - horizontalPadding*2 - gap) / 2

type Props = {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onPress?: (product: Product) => void;
};

const ProductCard = ({ product, onAddToCart, onPress }: Props) => {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => onPress?.(product)}
        >
            {/* Aspect Ratio 4/5 Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={product.imageUrl}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
            </View>

            {/* Info Section */}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                    {product.title}
                </Text>

                <Text style={styles.stock}>
                    Stock: {product.stock} disponibles
                </Text>

                <Text style={styles.price}>
                    {product.price.toLocaleString()} Fcfa
                </Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => onAddToCart?.(product)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.addButtonText}>Ajouter au panier</Text>
                </TouchableOpacity>
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
        // Shadows
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 4 / 5,
        backgroundColor: '#F9F9F9',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    info: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    stock: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    price: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: '#E67E22',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default memo(ProductCard);
