import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Category } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 42) / 2; // (width - horizontalPadding - gap) / 2

type Props = {
    category: Category;
    onPress?: (category: Category) => void;
};

const CategoryCard = ({ category, onPress }: Props) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(category)}
            activeOpacity={0.8}
        >
            <Image
                source={category.imageUrl}
                style={styles.image}
                contentFit="cover"
                transition={200}
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.overlay}
            >
                <Text style={styles.name}>{category.name}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: 180,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        justifyContent: 'flex-end',
        padding: 12,
    },
    name: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default memo(CategoryCard);
