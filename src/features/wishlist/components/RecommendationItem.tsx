import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecommendationItemType } from '../types';

type Props = {
    item: any; // Can be Product or RecommendationItemType
    onPress: (item: any) => void;
};

const RecommendationItem = ({ item, onPress }: Props) => {
    const imageUrl = item.product_profile ? { uri: item.product_profile } : item.imageUrl;
    const title = item.product_name || item.title || '';
    const price = item.product_price || item.price || 0;
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={() => onPress(item)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.price}>{price.toLocaleString()} FCFA</Text>
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
