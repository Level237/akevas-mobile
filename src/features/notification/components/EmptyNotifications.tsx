import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EmptyNotifications = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Ionicons name="notifications-off-outline" size={80} color="#DDD" />
            </View>
            <Text style={styles.title}>Pas encore de notifications</Text>
            <Text style={styles.description}>
                Vous recevrez ici vos confirmations de commande, promotions exclusives et alertes importantes.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        paddingTop: 100,
    },
    iconWrapper: {
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default EmptyNotifications;
