import { persistor, store } from '@/store';
import * as Notifications from 'expo-notifications'; // ← Ajouté
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { COLORS } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
// ← Ajouté (ajuste le chemin si besoin)

import { registerForPushNotificationsAsync } from '@/utils/notification';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    // ← États et Réfs pour les notifications
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        // 1. Initialiser les notifications au démarrage
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token);
                console.log('🔑 Push Token prêt:', token);

                // TODO: Ici, tu pourras sauvegarder ce token dans ton store Redux 
                // ou l'envoyer à ton backend décentralisé lié au profil utilisateur.
            }
        });

        // 2. Écouter les notifications reçues QUAND l'app est ouverte (premier plan)
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('🔔 Notification reçue (foreground):', notification);
            // Tu peux déclencher un Toast ou une mise à jour d'UI ici si tu veux
        });

        // 3. Écouter quand l'utilisateur CLIQUE sur une notification (arrière-plan ou fermé)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('👆 Utilisateur a cliqué sur la notification:', response);

            // EXEMPLE pour ton e-commerce :
            // const data = response.notification.request.content.data;
            // if (data.type === 'new_order') {
            //     router.push(`/orders/${data.orderId}`);
            // }
        });

        // 4. Nettoyage des écouteurs quand le composant est démonté
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    const LoadingScreen = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );

    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

                    {/* Optimisation : screenOptions appliqué à tous les enfants */}
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="welcome" />
                        <Stack.Screen name="preferences" />
                        <Stack.Screen name="(home)" />
                        <Stack.Screen name="(shop)" />
                        <Stack.Screen name="(navigation)" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="checkout" />
                        <Stack.Screen name="orders" />
                    </Stack>

                    <Toast />
                    <StatusBar style="auto" />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background || '#ffffff', // Ajout d'un fallback au cas où
    },
});