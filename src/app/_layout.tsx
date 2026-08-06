import { persistor, store } from '@/store';
import * as Notifications from 'expo-notifications';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { toastConfig } from '@/components/common/toastConfig';
import { COLORS } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerForPushNotificationsAsync } from '@/utils/notification';
import { setupNotificationCategories } from '@/utils/notificationCategories';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [expoPushToken, setExpoPushToken] = useState('');

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    // 🚀 FONCTION DÉDIÉE POUR GÉRER LE ROUTING (Plus propre et débogable)
    const handleNotificationRouting = (response: Notifications.NotificationResponse) => {
        const content = response.notification.request.content;
        const actionIdentifier = response.actionIdentifier;

        let data = content.data || {};
        const dataString = (content as any).dataString || data?.dataString;
        if (dataString) {
            try {
                data = { ...data, ...JSON.parse(dataString) };
            } catch (e) {
                console.error('❌ Erreur parsing', e);
            }
        }

        console.log('📦 Données:', data);
        console.log('🎯 Action:', actionIdentifier);

        // Délai pour s'assurer que l'UI est prête
        setTimeout(() => {
            try {
                // Priorité 1 : Action spécifique (iOS buttons)
                if (actionIdentifier === 'view_shops') {
                    router.replace('/(home)/shop');
                    return;
                }

                // Priorité 2 : Route dans les données
                if (data?.route) {
                    console.log('️ Navigation vers:', data.route);
                    router.replace(data.route as any);
                    return;
                }

                // Priorité 3 : Type de notification
                if (data?.type === 'welcome_marketplace') {
                    router.replace('/(home)/shop');
                    return;
                }


                if (data?.type === 'order_in_progress' && data?.orderId) {
                    console.log("Navigation vers le détail de la commande")
                    router.replace(`/orders/${data.orderId}`);
                    return;
                }

                // Fallback
                router.replace('/');

            } catch (error) {
                console.error('❌ Erreur navigation:', error);
                router.replace('/');
            }
        }, 500);
    };

    useEffect(() => {
        // Initialiser les catégories de notification
        setupNotificationCategories();

        // 1. Initialiser les notifications
        registerForPushNotificationsAsync().then(async (token) => {
            if (token) {
                setExpoPushToken(token);
                await SecureStore.setItemAsync('EXPO_PUSH_TOKEN', token);
            }
        });

        // 2. Écouter les notifications en premier plan
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('🔔 Notification reçue (foreground):', notification.request.content.title);
        });

        // 3. Écouter les clics sur les notifications (App en arrière-plan)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const actionIdentifier = response.actionIdentifier;
            const content = response.notification.request.content;

            console.log('👆 Action cliquée:', actionIdentifier);
            console.log('📦 Données:', content.data);

            // Gestion des actions iOS
            if (Platform.OS === 'ios') {
                if (actionIdentifier === 'view_shops') {
                    console.log('✅ Action: Voir les boutiques');
                    setTimeout(() => router.replace('/(home)/shop'), 500);
                    return;
                }
                if (actionIdentifier === 'explore_later') {
                    console.log('ℹ️ Action: Explorer plus tard');
                    return;
                }
                if (actionIdentifier === 'view_order') {
                    const orderId = content.data?.orderId;
                    if (orderId) {
                        setTimeout(() => router.replace(`/orders/${orderId}`), 500);
                    }
                    return;
                }
            }

            // Pour Android et le clic normal sur la notification
            handleNotificationRouting(response);
        });

        // 4. 🚀 GESTION DU COLD START (App totalement fermée)
        // C'est LA pièce manquante qui règle 90% des problèmes de deep linking
        Notifications.getLastNotificationResponseAsync().then(response => {
            if (response) {
                console.log('🚀 App ouverte via une notification (Cold Start)');
                // On attend un peu plus longtemps car l'app vient de démarrer
                setTimeout(() => {
                    handleNotificationRouting(response);
                }, 1000);
            }
        });

        // ⚠️ CORRECTION CRITIQUE : Tableau de dépendances VIDE []
        // Le listener doit être enregistré UNE SEULE FOIS au montage du composant.
        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove(); // ✅ Méthode moderne et sûre
            }
            if (responseListener.current) {
                responseListener.current.remove(); // ✅ Méthode moderne et sûre
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

                    <Toast config={toastConfig} position="bottom" bottomOffset={80} />
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
        backgroundColor: COLORS.background || '#ffffff',
    },
});