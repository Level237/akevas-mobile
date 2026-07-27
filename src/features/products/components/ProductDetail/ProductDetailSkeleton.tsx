import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProductDetailSkeleton() {
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
            {/* Header placeholder */}
            <View style={styles.header}>
                <Animated.View style={[styles.circle, { opacity }]} />
                <View style={styles.headerActions}>
                    <Animated.View style={[styles.circle, { opacity }]} />
                    <Animated.View style={[styles.circle, { opacity }]} />
                </View>
            </View>

            {/* Main Image Gallery Skeleton */}
            <Animated.View style={[styles.mainImage, { opacity }]} />
            
            {/* Thumbnails Skeleton */}
            <View style={styles.thumbnailsContainer}>
                {[1, 2, 3, 4, 5].map((item) => (
                    <Animated.View key={item} style={[styles.thumbnail, { opacity }]} />
                ))}
            </View>

            <View style={styles.content}>
                {/* Title and Price */}
                <Animated.View style={[styles.titleLine, { opacity, width: '80%' }]} />
                <Animated.View style={[styles.titleLine, { opacity, width: '40%', height: 16, marginTop: 10 }]} />
                
                <Animated.View style={[styles.priceLine, { opacity }]} />

                {/* Rating and Info */}
                <View style={styles.row}>
                    <Animated.View style={[styles.infoBlock, { opacity }]} />
                    <Animated.View style={[styles.infoBlock, { opacity }]} />
                </View>

                {/* Variations */}
                <Animated.View style={[styles.titleLine, { opacity, width: '30%', height: 16, marginTop: 24 }]} />
                <View style={styles.variationsRow}>
                    {[1, 2, 3, 4].map((item) => (
                        <Animated.View key={`var-${item}`} style={[styles.variationCircle, { opacity }]} />
                    ))}
                </View>

                {/* Tabs */}
                <View style={styles.tabsRow}>
                    <Animated.View style={[styles.tab, { opacity }]} />
                    <Animated.View style={[styles.tab, { opacity }]} />
                </View>
                
                {/* Description Lines */}
                <View style={styles.descriptionBlock}>
                    <Animated.View style={[styles.descLine, { opacity }]} />
                    <Animated.View style={[styles.descLine, { opacity }]} />
                    <Animated.View style={[styles.descLine, { opacity, width: '70%' }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    mainImage: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#E5E7EB',
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        padding: 15,
        gap: 10,
        overflow: 'hidden',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
    },
    content: {
        padding: 15,
    },
    titleLine: {
        height: 24,
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
    },
    priceLine: {
        height: 30,
        width: '45%',
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 15,
    },
    infoBlock: {
        height: 20,
        width: 100,
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
    },
    variationsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    variationCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 10,
    },
    tab: {
        height: 20,
        width: 80,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    descriptionBlock: {
        marginTop: 20,
        gap: 10,
    },
    descLine: {
        height: 14,
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
});
