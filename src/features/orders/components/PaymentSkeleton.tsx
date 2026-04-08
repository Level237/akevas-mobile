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

export const PaymentSkeleton = () => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <SkeletonLoader width={48} height={48} style={{ borderRadius: 24 }} />
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.headerRow}>
                    <SkeletonLoader width="40%" height={20} style={{ borderRadius: 6 }} />
                    <SkeletonLoader width="30%" height={20} style={{ borderRadius: 6 }} />
                </View>
                <View style={styles.footerRow}>
                    <SkeletonLoader width="35%" height={14} style={{ borderRadius: 4, marginTop: 8 }} />
                    <SkeletonLoader width={60} height={24} style={{ borderRadius: 12, marginTop: 4 }} />
                </View>
                <SkeletonLoader width="50%" height={12} style={{ borderRadius: 4, marginTop: 10 }} />
            </View>
        </View>
    );
};

export const PaymentListSkeleton = () => {
    return (
        <View style={styles.listContainer}>
            <PaymentSkeleton />
            <PaymentSkeleton />
            <PaymentSkeleton />
            <PaymentSkeleton />
            <PaymentSkeleton />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 16,
        justifyContent: 'center',
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
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skeleton: {
        backgroundColor: '#E5E7EB',
    },
});
