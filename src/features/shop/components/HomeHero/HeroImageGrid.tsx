import React from 'react';
import { StyleSheet, View } from 'react-native';

// These could be passed as props, but using placeholders for now as per constraints
const HeroImageGrid = () => {
    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                <View style={styles.row}>
                    <View style={styles.imageBox} />
                    <View style={styles.imageBox} />
                </View>
                <View style={styles.row}>
                    <View style={styles.imageBox} />
                    <View style={styles.imageBox} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    grid: {
        width: '90%', // Use more width
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

export default HeroImageGrid;
