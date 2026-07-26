import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function setupNotificationCategories() {
    if (Platform.OS === 'ios') {
        // Configuration iOS
        await Notifications.setNotificationCategoryAsync('welcome', [
            {
                identifier: 'view_shops',
                buttonTitle: 'Voir les boutiques ️',
                options: {
                    opensAppToForeground: true,
                },
            },
            {
                identifier: 'explore_later',
                buttonTitle: 'Plus tard',
                options: {
                    opensAppToForeground: false,
                },
            },
        ]);
    } else if (Platform.OS === 'android') {
        // Configuration Android (via les canaux)
        await Notifications.setNotificationChannelAsync('welcome', {
            name: 'Notifications de bienvenue',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
            // Les actions Android se configurent différemment
            // Voir note ci-dessous
        });
    }
}