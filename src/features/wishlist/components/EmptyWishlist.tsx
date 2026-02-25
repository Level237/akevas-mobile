import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EmptyWishlist = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="heart-dislike-outline" size={80} color="#E67E22" />
            </View>
            <Text style={styles.title}>Votre liste de coups de cœur est vide.</Text>
            <Text style={styles.subtitle}>
                Explorez nos produits et ajoutez vos articles préférés ici pour les retrouver plus tard.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/(navigation)/explore')}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Découvrir les produits</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 2,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        marginBottom: 24,
        opacity: 0.8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#E67E22',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#E67E22',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EmptyWishlist;
