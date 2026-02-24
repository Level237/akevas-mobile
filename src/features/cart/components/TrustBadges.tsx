import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TrustBadges = () => {
    const badges = [
        {
            icon: 'cube-outline' as const,
            title: 'Livraison rapide',
            description: 'Pour toute commande',
            color: '#E67E22',
        },
        {
            icon: 'shield-checkmark-outline' as const,
            title: 'Garantie premium',
            description: '30 jours satisfait ou remboursé',
            color: '#E67E22',
        },
        {
            icon: 'card-outline' as const,
            title: 'Paiement sécurisé',
            description: 'Par carte ou PayPal',
            color: '#E67E22',
        },
    ];

    return (
        <View style={styles.container}>
            {badgeProps(badges[0])}
            {badgeProps(badges[1])}
            {badgeProps(badges[2])}
        </View>
    );
};

const badgeProps = (badge: { icon: any; title: string; description: string; color: string }) => (
    <View style={styles.badgeCard} key={badge.title}>
        <View style={styles.iconWrapper}>
            <Ionicons name={badge.icon} size={28} color={badge.color} />
        </View>
        <View style={styles.textWrapper}>
            <Text style={styles.title}>{badge.title}</Text>
            <Text style={styles.description}>{badge.description}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    badgeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF8F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textWrapper: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    description: {
        fontSize: 13,
        color: '#999',
        fontWeight: '400',
    },
});

export default TrustBadges;
