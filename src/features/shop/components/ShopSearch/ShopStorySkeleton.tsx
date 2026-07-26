import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function ShopStorySkeleton() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <View style={styles.storyItem}>
            <Animated.View style={[styles.storyImageContainer, { opacity }]} />
            <Animated.View style={[styles.storyText, { opacity }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    storyItem: {
        width: 70,
        marginRight: 16,
        alignItems: 'center',
    },
    storyImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#E5E7EB',
        marginBottom: 8,
    },
    storyText: {
        width: 50,
        height: 10,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
});
