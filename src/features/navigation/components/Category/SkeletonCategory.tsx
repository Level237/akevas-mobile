import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';

const SkeletonCategory = () => {
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

    return (
        <View style={styles.container}>
            <FlatList
                data={[1, 2, 3, 4, 5, 6]}
                keyExtractor={(item) => item.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <View key={item} style={styles.category}>
                        <Animated.View style={[styles.categoryImage, { opacity: pulseAnim }]} />
                    </View>
                )}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    gridContent: {
        padding: 16,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    category: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e5e7eb',
    },
});

export default SkeletonCategory;
