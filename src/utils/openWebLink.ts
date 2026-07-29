import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

/**
 * Ouvre un lien web à l'intérieur de l'application (In-App Browser)
 * @param url L'URL à ouvrir (ex: 'https://akevas.com/privacy')
 */
export const openWebLink = async (url: string) => {
    try {
        // Vérifie que l'URL commence bien par http:// ou https://
        const validUrl = url.startsWith('http') ? url : `https://${url}`;

        await WebBrowser.openBrowserAsync(validUrl, {
            // Personnalisation de l'apparence (optionnel mais recommandé)
            toolbarColor: '#ed7e0f', // Ta couleur primaire Akevas
            controlsColor: '#ffffff', // Couleur des icônes (fermer, rafraîchir)
            showTitle: true,
            enableBarCollapsing: false,
        });
    } catch (error) {
        console.error('Erreur ouverture lien web:', error);
        Alert.alert('Erreur', 'Impossible d\'ouvrir le lien pour le moment.');
    }
};