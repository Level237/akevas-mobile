import { Stack } from 'expo-router';

export default function OrderLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            headerTintColor: '#E67E22',
            headerBackTitle: 'Retour',
        }}>
            <Stack.Screen name="index" options={{ title: 'Commandes' }} />
            <Stack.Screen name="[id]" options={{ title: 'Détail Commande' }} />
        </Stack>
    );
}
