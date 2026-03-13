import { usePushNotifications } from '@/hooks/usePushNotifications';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

// ============================================================
// 1. CONFIGURATION GLOBALE (En dehors du composant)
// ============================================================
// Cela doit être exécuté dès le chargement du fichier pour configurer le comportement
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// ============================================================
// 2. HOOK OBSERVER (Écouteur de clic)
// ============================================================
const useNotificationObserver = () => {
    const router = useRouter();

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            // Quand l'utilisateur clique sur une notif
            const data = response.notification.request.content.data;

            console.log('Notification cliquée :', data);

            // Redirection intelligente selon les données envoyées par Laravel
            if (data.orderId) {
                router.push(`/orders/${data.orderId}`);
            } else if (data.shopId) {
                router.push(`/shops/${data.shopId}`);
            }
        });

        return () => subscription.remove();
    }, []);
};

// ============================================================
// 3. LE COMPOSANT PRINCIPAL
// ============================================================
const NotificationManager = () => {
    // A. On active l'écouteur des clics (nécessite le Router)
    useNotificationObserver();

    // B. On active l'enregistrement du Token (nécessite Redux, donc OK ici car on est dans _layout)
    const { registerForPushNotificationsAsync, saveTokenToServer } = usePushNotifications();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) saveTokenToServer(token);
        });
    }, []);

    // Ce composant ne rend rien visuellement
    return null;
};

export default NotificationManager;