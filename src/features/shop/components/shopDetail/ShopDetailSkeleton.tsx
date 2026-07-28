import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ShopDetailSkeleton() {
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
            {/* Header (Banner + Avatar) */}
            <View style={styles.headerContainer}>
                <Animated.View style={[styles.bannerSkeleton, { opacity }]} />
                
                <View style={styles.profileContainer}>
                    <Animated.View style={[styles.avatarSkeleton, { opacity }]} />
                    <View style={styles.shopInfo}>
                        <Animated.View style={[styles.titleSkeleton, { opacity }]} />
                        <Animated.View style={[styles.subtitleSkeleton, { opacity }]} />
                    </View>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <Animated.View style={[styles.tabSkeleton, { opacity, width: 80 }]} />
                <Animated.View style={[styles.tabSkeleton, { opacity, width: 80 }]} />
                <Animated.View style={[styles.tabSkeleton, { opacity, width: 80 }]} />
            </View>

            {/* Products Grid */}
            <View style={styles.gridContainer}>
                {[1, 2, 3, 4].map((item) => (
                    <View key={item} style={styles.productCard}>
                        <Animated.View style={[styles.productImageSkeleton, { opacity }]} />
                        <Animated.View style={[styles.productTitleSkeleton, { opacity }]} />
                        <Animated.View style={[styles.productPriceSkeleton, { opacity }]} />
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    headerContainer: {
        backgroundColor: '#FFF',
        paddingBottom: 20,
    },
    bannerSkeleton: {
        width: '100%',
        height: 180,
        backgroundColor: '#E5E7EB',
    },
    profileContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: -35, // To overlap the banner
        alignItems: 'flex-end',
    },
    avatarSkeleton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1D5DB', // Slightly darker to contrast with banner
        borderWidth: 4,
        borderColor: '#FFF',
    },
    shopInfo: {
        marginLeft: 15,
        marginBottom: 10,
        flex: 1,
    },
    titleSkeleton: {
        height: 20,
        width: '60%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 8,
    },
    subtitleSkeleton: {
        height: 14,
        width: '40%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        gap: 15,
    },
    tabSkeleton: {
        height: 30,
        backgroundColor: '#E5E7EB',
        borderRadius: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
    },
    productCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
    },
    productImageSkeleton: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginBottom: 10,
    },
    productTitleSkeleton: {
        height: 14,
        width: '80%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 6,
    },
    productPriceSkeleton: {
        height: 16,
        width: '50%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
});
