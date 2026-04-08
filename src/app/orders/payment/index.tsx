import HeaderScreen from '@/components/common/HeaderScreen';
import { PaymentScreen } from '@/features/orders/screens/PaymentScreen';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function PaymentHistoryRoute() {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: false }} />
            <HeaderScreen title="Historique de paiement" />
            <PaymentScreen />
        </View>
    );
}
