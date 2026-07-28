import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const RecommendationItemSkeleton = () => {
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
        <View style={styles.container}>
            <Animated.View style={[styles.imageSkeleton, { opacity }]} />
            <View style={styles.info}>
                <Animated.View style={[styles.titleSkeleton, { opacity }]} />
                <Animated.View style={[styles.priceSkeleton, { opacity }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 140,
        marginRight: 16,
    },
    imageSkeleton: {
        width: 140,
        height: 180,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
    },
    info: {
        marginTop: 8,
    },
    titleSkeleton: {
        height: 12,
        width: '80%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 6,
    },
    priceSkeleton: {
        height: 14,
        width: '50%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginTop: 2,
    },
});

export default RecommendationItemSkeleton;
