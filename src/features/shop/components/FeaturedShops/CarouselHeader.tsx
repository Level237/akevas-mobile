import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CarouselHeader = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Boutiques en vedette</Text>
            <Text style={styles.subtitle}>Découvrez les boutiques en vedette</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        marginBottom: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});

export default CarouselHeader;
