import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { styles as commonStyles } from './style';

export default function ShopCardCompactSkeleton() {
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
        <View style={commonStyles.compactContainer}>
            <Animated.View style={[styles.skeletonImage, { opacity }]} />
            
            <View style={commonStyles.compactContent}>
                <View>
                    <Animated.View style={[styles.skeletonTitle, { opacity }]} />
                    <Animated.View style={[styles.skeletonText, { opacity, marginTop: 10, width: '40%' }]} />
                    <Animated.View style={[styles.skeletonText, { opacity, marginTop: 8, width: '60%' }]} />
                </View>

                <View style={commonStyles.compactFooter}>
                    <View style={commonStyles.compactTagsRow}>
                        <Animated.View style={[styles.skeletonTag, { opacity }]} />
                        <Animated.View style={[styles.skeletonTag, { opacity, width: 40 }]} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    skeletonImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
    },
    skeletonTitle: {
        height: 18,
        width: '70%',
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    skeletonText: {
        height: 12,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    skeletonTag: {
        height: 20,
        width: 50,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
    }
});
