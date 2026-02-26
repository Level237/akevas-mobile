import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const HeroSkeleton = () => {
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        pulse.start();
        return () => pulse.stop();
    }, [pulseAnim]);

    const SkeletonBox = () => (
        <Animated.View style={[styles.imageBox, { opacity: pulseAnim }]} />
    );

    return (
        <View style={styles.grid}>
            <View style={styles.row}>
                <SkeletonBox />
                <SkeletonBox />
            </View>
            <View style={styles.row}>
                <SkeletonBox />
                <SkeletonBox />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        width: '90%',
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    imageBox: {
        flex: 1,
        aspectRatio: 1.4,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
});

export default React.memo(HeroSkeleton);
