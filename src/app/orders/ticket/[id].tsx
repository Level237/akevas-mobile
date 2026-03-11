import OrderTicketDetailScreen from '@/features/orders/screens/OrderTicketDetailScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function TicketRoute() {
    const { id } = useLocalSearchParams();

    return <OrderTicketDetailScreen reference={id as string} />;
}
