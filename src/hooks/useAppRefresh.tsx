import { COLORS } from '@/constants/colors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useAppRefresh = (refetchFunction: () => Promise<any> | void) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    // Animation pour la barre de progression
    const progressAnim = useRef(new Animated.Value(0)).current;

    // 🆕 Animation pour l'assombrissement de l'écran
    const overlayAnim = useRef(new Animated.Value(0)).current;

    // Effet pour gérer les animations
    useEffect(() => {
        if (isRefreshing) {
            // 1. Démarrer la barre de progression en boucle
            Animated.loop(
                Animated.timing(progressAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                })
            ).start();

            // 2. Assombrir l'écran (Opacité de 0 à 1)
            Animated.timing(overlayAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true, // On peut utiliser le driver natif pour l'opacité
            }).start();
        } else {
            // Arrêter tout et remettre à zéro
            progressAnim.setValue(0);

            // Éclaircir l'écran (Opacité de 1 à 0)
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isRefreshing]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        Promise.resolve(refetchFunction()).finally(() => {
            setIsRefreshing(false);
        });
    }, [refetchFunction]);

    const refreshControl = (
        <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressBackgroundColor="#F8F8F8"
        />
    );

    // La Barre de Progression (Z-Index 20 pour être au-dessus de tout)
    const ProgressBar = () => {
        if (!isRefreshing) return null;
        return (
            <View style={[styles.progressBarContainer, { top: insets.top, zIndex: 20 }]}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
            </View>
        );
    };

    // 🆕 Le Calque Sombre (Z-Index 10 pour être sous la barre mais au-dessus du contenu)
    const DimOverlay = () => {
        return (
            <Animated.View
                pointerEvents="none" // 🔥 CRUCIAL : permet de toucher la liste à travers le calque
                style={[
                    styles.overlay,
                    {
                        opacity: overlayAnim,
                        top: 0,        // Commence tout en haut de l'écran
                        left: 0,
                        right: 0,
                        bottom: 0,     // Va tout en bas
                        zIndex: 999, // Couvre toute la hauteur disponible
                    }
                ]}
            />
        );
    };

    return { isRefreshing, refreshControl, onRefresh, ProgressBar, DimOverlay };
};

const styles = StyleSheet.create({
    // ... styles existants
    progressBarContainer: {
        height: 3,
        width: '100%',
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        zIndex: 20, // Au-dessus de l'overlay
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    // 🆕 Style pour l'overlay sombre
    overlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Noir à 20% d'opacité
        zIndex: 999, // En dessous de la barre de progression
        pointerEvents: 'none', // Laisse passer les touch events
    },
});