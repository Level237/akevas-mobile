import { OnboardingScreen, SplashScreen } from '@/features/welcome';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export default function Index() {
    const [isReady, setIsReady] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                // 1. Vérifier si l'onboarding a déjà été complété
                const onboardingCompleted = await SecureStore.getItemAsync('ONBOARDING_COMPLETED');

                // 2. Si c'est 'true', on prépare la redirection
                if (onboardingCompleted === 'true') {
                    setShouldRedirect(true);
                }
            } catch (error) {
                console.error('Erreur lecture SecureStore:', error);
            } finally {
                // 3. Dans tous les cas, le chargement est terminé
                setIsReady(true);
            }
        };

        checkOnboardingStatus();
    }, []);

    // 🔄 Pendant la vérification, on affiche un loader propre (évite le flash blanc)
    if (!isReady) {
        return <SplashScreen />;
    }

    // ✅ Si l'onboarding est déjà fait, on redirige immédiatement vers la homepage
    if (shouldRedirect) {
        // Remplace "/(home)" par "/(tabs)" si c'est ton point d'entrée principal
        return <Redirect href="/(home)" />;
    }

    // ❌ Sinon, on affiche normalement l'écran d'onboarding
    return <OnboardingScreen />;
}