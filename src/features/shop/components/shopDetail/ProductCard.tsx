import { Image } from 'expo-image';
import React, { memo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from './types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 15) / 2;

type Props = {
    product: Product;
    onPress?: (product: Product) => void;
};

const ProductCard = ({ product, onPress }: Props) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(product)}
            activeOpacity={0.8}
        >
            <Image
                source={product.imageUrl}
                style={styles.image}
                contentFit="cover"
                transition={200}
            />
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {product.name}
                </Text>
                <Text style={styles.price}>{product.price.toLocaleString()} FCFA</Text>
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
