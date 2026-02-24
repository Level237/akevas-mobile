import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    subtotal: number;
    deliveryFee: number;
    total: number;
    onCheckout: () => void;
};

const OrderSummary = ({ subtotal, deliveryFee, total, onCheckout }: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Résumé de la commande</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Sous-total</Text>
                <Text style={styles.value}>{subtotal.toLocaleString()}.00 FCFA</Text>
            </View>

            <View style={styles.divider} />

            <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{total.toLocaleString()}.00 FCFA</Text>
            </View>

            <TouchableOpacity
                style={styles.checkoutButton}
                activeOpacity={0.85}
                onPress={onCheckout}
            >
                <Text style={styles.checkoutText}>Procéder au paiement</Text>
            </TouchableOpacity>

            <Text style={styles.secureText}>Paiement 100% sécurisé</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        // Lift shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#999',
    },
    value: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 16,
    },
    totalRow: {
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
    },
    checkoutButton: {
        backgroundColor: '#E67E22',
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secureText: {
        fontSize: 12,
        color: '#BBB',
        textAlign: 'center',
    },
});

export default OrderSummary;
