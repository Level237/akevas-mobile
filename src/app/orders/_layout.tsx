import { Stack } from 'expo-router';
import React from 'react';

export default function OrderLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            headerTintColor: '#E67E22',
            headerBackTitle: 'Retour',
        }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}
