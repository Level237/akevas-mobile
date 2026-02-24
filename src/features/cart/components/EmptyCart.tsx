import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EmptyCart = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <Ionicons name="cart-outline" size={60} color="#E67E22" />
            </View>
            <Text style={styles.title}>Votre panier est vide</Text>
            <Text style={styles.subtitle}>
                Il semble que vous n'ayez pas encore ajouté d'articles à votre panier.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/')}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Explorer les produits</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
        backgroundColor: '#F9F9F9',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF5EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#E67E22',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
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
        fontWeight: 'bold',
    },
});

export default EmptyCart;
