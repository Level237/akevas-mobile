import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const SkeletonBlock = ({ width, height, style }: { width?: string | number, height?: number, style?: any }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 800,
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

const NotificationSkeletonItem = () => {
    return (
        <View style={styles.container}>
            <SkeletonBlock width={48} height={48} style={{ borderRadius: 24 }} />
            <View style={styles.content}>
                <SkeletonBlock width="60%" height={16} style={{ borderRadius: 4 }} />
                <SkeletonBlock width="90%" height={12} style={{ borderRadius: 4, marginTop: 8 }} />
                <SkeletonBlock width="40%" height={12} style={{ borderRadius: 4, marginTop: 8 }} />
            </View>
        </View>
    );
};

export const NotificationSkeleton = () => {
    return (
        <View style={styles.list}>
            <NotificationSkeletonItem />
            <NotificationSkeletonItem />
            <NotificationSkeletonItem />
            <NotificationSkeletonItem />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingTop: 8,
    },
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    skeleton: {
        backgroundColor: '#E5E7EB',
    },
});