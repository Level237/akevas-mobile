import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useAppSelector } from './hooks';

export const usePushNotifications = () => {
    const user = useAppSelector((state) => state.auth.user);

    const registerForPushNotificationsAsync = async () => {
        if (!Device.isDevice) {
            alert('Must use physical device for Push Notifications');
            return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        // ✅ CORRECTION ICI : On lit la variable d'environnement
        // Si tu n'as pas redémarré le serveur, process.env sera vide !
        const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;

        if (!projectId) {
            console.error("ERREUR: EXPO_PUBLIC_PROJECT_ID n'est pas défini dans .env");
            return;
        }

        console.log("Project ID utilisé :", projectId);

        const token = (await Notifications.getExpoPushTokenAsync({
            projectId: projectId
        })).data;

        console.log('PUSH TOKEN:', token);

        return token;
    };

    const saveTokenToServer = async (token: string) => {
        if (user && token) {
            // ... appel API
            console.log('Token envoyé au serveur pour le user:', user.id);
        }
    };

    return { registerForPushNotificationsAsync, saveTokenToServer };
};