import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { PaymentItemCard, PaymentRecord } from '../components/PaymentItemCard';
import { PaymentListSkeleton } from '../components/PaymentSkeleton';

// Mock Data
const MOCK_PAYMENTS: PaymentRecord[] = [
    {
        id: '1',
        amount: 15400,
        date: '24 Mar 2026, 14:30',
        status: 'success',
        method: 'Orange Money',
        reference: 'TXN-8472948293M'
    },
    {
        id: '2',
        amount: 8500,
        date: '21 Mar 2026, 09:15',
        status: 'failed',
        method: 'MTN Mobile Money',
        reference: 'TXN-9384729104M'
    },
    {
        id: '3',
        amount: 32000,
        date: '18 Mar 2026, 16:45',
        status: 'success',
        method: 'Carte Visa',
        reference: 'TXN-VISA-938472'
    },
    {
        id: '4',
        amount: 12000,
        date: '15 Mar 2026, 11:00',
        status: 'canceled',
        method: 'Orange Money',
        reference: 'TXN-0192837465'
    },
    {
        id: '5',
        amount: 5500,
        date: '10 Mar 2026, 08:20',
        status: 'success',
        method: 'MTN Mobile Money',
        reference: 'TXN-9948837123'
    }
];

export const PaymentScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setPayments(MOCK_PAYMENTS);
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <PaymentListSkeleton />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={payments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PaymentItemCard payment={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucun historique de paiement</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    listContent: {
        paddingBottom: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
});
