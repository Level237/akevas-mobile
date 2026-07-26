import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ✅ CORRECTION DU WARNING : Utilisation des nouvelles propriétés SDK 57
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,  // Affiche la bannière en haut de l'écran
        shouldShowList: true,    // Affiche dans le centre de notifications
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Demande les permissions et retourne le Expo Push Token
 * @returns Le token sous forme de string, ou null en cas d'échec
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    // 1. Vérifier si on est sur un appareil physique (les émulateurs n'ont pas de token push valide)
    if (Device.isDevice) {
        // 2. Vérifier les permissions existantes
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // 3. Demander la permission si elle n'est pas encore accordée
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        // 4. Si l'utilisateur a refusé, on arrête tout
        if (finalStatus !== 'granted') {
            console.log('⚠️ Permission de notification refusée par l\'utilisateur.');
            return null;
        }

        // 5. Récupérer le Project ID depuis app.json (nécessaire pour le SDK 57+)
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) {
            console.error('❌ Project ID introuvable. Vérifie la section "extra.eas" dans app.json');
            return null;
        }

        // 6. Obtenir le token Expo Push
        try {
            const pushTokenData = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            token = pushTokenData.data;
            console.log('✅ Push Token obtenu avec succès:', token);
        } catch (error) {
            console.error('❌ Erreur lors de l\'obtention du token Expo:', error);
        }
    } else {
        console.log('⚠️ Les notifications push nécessitent un appareil physique (pas d\'émulateur).');
    }

    // 7. Configuration spécifique Android (Canaux de notification obligatoires)
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Akevas Notifications',
            importance: Notifications.AndroidImportance.MAX, // Priorité haute
            vibrationPattern: [0, 250, 250, 250], // Motif de vibration
            lightColor: '#FF231F7C', // Couleur du voyant LED (si supporté)
            //sound: 'default',
        });
    }

    return token;
}