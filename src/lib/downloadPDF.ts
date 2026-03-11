import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const downloadPDFSimple = async (fileUrl: string, fileName: string = "facture.pdf") => {
    try {
        // 1. Définir le chemin
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        console.log("Téléchargement vers :", fileUri);

        // 2. Téléchargement Simple (Plus besoin de 'createDownloadResumable')
        const downloadResult = await FileSystem.downloadAsync(
            fileUrl,
            fileUri
        );

        // 3. Vérification du statut HTTP
        if (downloadResult.status === 200) {
            console.log("Téléchargement terminé !");

            // 4. Ouverture / Partage
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(downloadResult.uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Enregistrer le PDF',
                });
            }
        } else {
            throw new Error(`Erreur serveur: ${downloadResult.status}`);
        }

    } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Impossible de télécharger le fichier.");
    }
};