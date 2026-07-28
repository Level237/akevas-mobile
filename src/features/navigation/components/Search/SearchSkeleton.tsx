import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function SearchSkeleton() {
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
            {/* Section Boutiques */}
            <View style={styles.sectionHeader}>
                <Animated.View style={[styles.titleSkeleton, { opacity }]} />
            </View>
            <View style={styles.shopsContainer}>
                {[1, 2, 3, 4].map((item) => (
                    <View key={item} style={styles.shopCard}>
                        <Animated.View style={[styles.shopBanner, { opacity }]} />
                        <Animated.View style={[styles.shopAvatar, { opacity }]} />
                        <Animated.View style={[styles.shopTitle, { opacity }]} />
                    </View>
                ))}
            </View>

            {/* Section Produits */}
            <View style={styles.sectionHeader}>
                <Animated.View style={[styles.titleSkeleton, { opacity }]} />
            </View>
            <View style={styles.productsGrid}>
                {[1, 2, 3, 4].map((item) => (
                    <View key={item} style={styles.productCard}>
                        <Animated.View style={[styles.productImage, { opacity }]} />
                        <Animated.View style={[styles.productTitle, { opacity }]} />
                        <Animated.View style={[styles.productPrice, { opacity }]} />
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        marginTop: 10,
    },
    titleSkeleton: {
        height: 16,
        width: 100,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    shopsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingBottom: 15,
        gap: 15,
        overflow: 'hidden',
    },
    shopCard: {
        width: 140,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        overflow: 'hidden',
        alignItems: 'center',
        paddingBottom: 12,
    },
    shopBanner: {
        width: '100%',
        height: 60,
        backgroundColor: '#E5E7EB',
    },
    shopAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D1D5DB',
        marginTop: -20,
        borderWidth: 2,
        borderColor: '#FFF',
        marginBottom: 8,
    },
    shopTitle: {
        height: 12,
        width: '60%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    productCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        aspectRatio: 3 / 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginBottom: 10,
    },
    productTitle: {
        height: 14,
        width: '80%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 6,
    },
    productPrice: {
        height: 16,
        width: '50%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
});
