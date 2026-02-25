import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WishlistItemType } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Props = {
    item: WishlistItemType;
    onRemove: (id: string) => void;
    onAddToCart: (item: WishlistItemType) => void;
    onPress?: (item: WishlistItemType) => void;
};

const WishlistItem = ({ item, onRemove, onAddToCart, onPress }: Props) => {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => onPress?.(item)}
        >
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={item.imageUrl}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />

                {/* Favorite Icon (Always filled red) */}
                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => onRemove(item.id)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="heart" size={18} color="#E74C3C" />
                </TouchableOpacity>
            </View>

            {/* Product Details */}
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

                <View style={styles.footer}>
                    <Text style={styles.price}>{item.price.toLocaleString()} FCFA</Text>

                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => onAddToCart(item)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="cart" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        // Soft shadow
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
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    details: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    cartButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#E67E22', // Akevas Orange
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WishlistItem;
