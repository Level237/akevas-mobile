import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type PaymentStatus = 'success' | 'failed' | 'canceled';

export type PaymentRecord = {
    id: string;
    amount: number;
    date: string;
    status: PaymentStatus;
    method: string;
    reference: string;
};

type Props = {
    payment: PaymentRecord;
};

const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
        case 'success':
            return { color: '#059669', bgColor: '#D1FAE5', label: 'Succès' };
        case 'failed':
            return { color: '#DC2626', bgColor: '#FEE2E2', label: 'Échec' };
        case 'canceled':
            return { color: '#4B5563', bgColor: '#F3F4F6', label: 'Annulé' };
        default:
            return { color: '#4B5563', bgColor: '#F3F4F6', label: 'Inconnu' };
    }
};

const getMethodIcon = (method: string): any => {
    const m = method.toLowerCase();
    if (m.includes('orange') || m.includes('mtn') || m.includes('mobile')) return 'phone-portrait-outline';
    if (m.includes('visa') || m.includes('card')) return 'card-outline';
    return 'cash-outline';
};

export const PaymentItemCard = ({ payment }: Props) => {
    const statusConfig = getStatusConfig(payment.status);

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                    <Ionicons name={getMethodIcon(payment.method)} size={24} color="#6B7280" />
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.methodText}>{payment.method}</Text>
                    <Text style={styles.amountText}>
                        {payment.amount.toLocaleString('fr-FR')} FCFA
                    </Text>
                </View>
                <View style={styles.footerRow}>
                    <Text style={styles.dateText}>{payment.date}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                            {statusConfig.label}
                        </Text>
                    </View>
                </View>
                <Text style={styles.refText}>Réf: {payment.reference}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 16,
        justifyContent: 'center',
    },
    iconBackground: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    methodText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    dateText: {
        fontSize: 13,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    refText: {
        fontSize: 11,
        color: '#9CA3AF',
        fontFamily: 'monospace',
    },
});
