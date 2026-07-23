// utils/notifications.ts
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure le comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    // 1. Vérifier si on est sur un appareil physique (les simulateurs n'ont pas de token push valide)
    if (Device.isDevice) {
        // 2. Demander la permission (iOS uniquement, Android l'accorde par défaut)
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permission refusée pour les notifications !');
            return null;
        }

        // 3. Obtenir le token Expo Push Token
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) {
            console.log('Project ID introuvable dans app.json');
            return null;
        }

        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log('✅ Push Token obtenu:', pushTokenString);
            token = pushTokenString;
        } catch (error) {
            console.error('Erreur lors de l\'obtention du token:', error);
        }
    } else {
        console.log('Doit utiliser un appareil physique pour les notifications push');
    }

    // 4. Configuration spécifique Android (Canaux de notification)
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}