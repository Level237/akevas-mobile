import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const SkeletonLoader = ({ width, height, style }: { width?: string | number, height?: number, style?: any }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width: width || '100%', height: height || 20, opacity },
                style,
            ]}
        />
    );
};

export const OrderSkeleton = () => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <SkeletonLoader width={80} height={80} style={{ borderRadius: 12 }} />
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.headerRow}>
                    <SkeletonLoader width="40%" height={24} style={{ borderRadius: 6 }} />
                    <SkeletonLoader width={80} height={24} style={{ borderRadius: 12 }} />
                </View>
                <SkeletonLoader width="60%" height={16} style={{ borderRadius: 4, marginTop: 8 }} />
                <SkeletonLoader width="50%" height={14} style={{ borderRadius: 4, marginTop: 8 }} />

                <View style={styles.itemsPreview}>
                    <SkeletonLoader width="80%" height={12} style={{ borderRadius: 4 }} />
                    <SkeletonLoader width="70%" height={12} style={{ borderRadius: 4, marginTop: 4 }} />
                </View>
            </View>
        </View>
    );
};

export const OrdersListSkeleton = () => {
    return (
        <View style={styles.container}>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        marginRight: 16,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skeleton: {
        backgroundColor: '#E5E7EB',
    },
    itemsPreview: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    }
});
