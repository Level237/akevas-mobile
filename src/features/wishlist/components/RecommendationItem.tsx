import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecommendationItemType } from '../types';

type Props = {
    item: RecommendationItemType;
    onAddToCart: (item: RecommendationItemType) => void;
    onFavorite: (item: RecommendationItemType) => void;
    onPress: (item: RecommendationItemType) => void;
};

const RecommendationItem = ({ item, onAddToCart, onFavorite, onPress }: Props) => {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => onPress(item)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={item.imageUrl}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onFavorite(item)}
                    >
                        <Ionicons name="heart-outline" size={16} color="#E67E22" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onAddToCart(item)}
                    >
                        <Ionicons name="cart-outline" size={16} color="#E67E22" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.price}>{item.price.toLocaleString()} FCFA</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 140,
        marginRight: 16,
    },
    imageContainer: {
        width: 140,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    actions: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
        gap: 6,
    },
    actionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E67E22',
    },
    info: {
        marginTop: 8,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
        marginTop: 2,
    },
});

export default RecommendationItem;
