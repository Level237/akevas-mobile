
import MobileMoneyPaymentScreen from '@/features/checkout/screens/MobileMoneyPaymentScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const PaymentRoute = () => {
    const { orderData } = useLocalSearchParams();

    const parsedOrderData = orderData ? JSON.parse(orderData as string) : null;

    if (!parsedOrderData) return null;

    return <MobileMoneyPaymentScreen orderData={parsedOrderData} />;
};

export default PaymentRoute;
