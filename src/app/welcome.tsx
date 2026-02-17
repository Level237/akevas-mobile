import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COLORS = {
    primary: '#ed7e0f',
    background: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    surface: '#f5f5f5',
};

export default function WelcomeScreen() {

    const insets = useSafeAreaInsets();
    const handleGuest = () => {
        router.replace('/(tabs)');
    };

    const handleLogin = () => {
        // Navigate to login (to be implemented)
        console.log('Navigate to login');
    };

    const handleRegister = () => {
        // Navigate to register (to be implemented)
        console.log('Navigate to register');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <StatusBar style="dark" />

            <View style={styles.content}>
                {/* Top Illustration */}
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../assets/images/welcome.png')}
                        style={styles.illustration}
                        contentFit="contain"
                    />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.headline}>Bienvenue sur Akevas</Text>
                    <Text style={styles.subheadline}>
                        Découvrez une Marketplace unique, simple et sécurisée pour tous vos besoins.
                    </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {/* Primary: guest */}
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleGuest}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Découvrir la Marketplace</Text>
                    </TouchableOpacity>

                    {/* Secondary: Login */}
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleLogin}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryButtonText}>Se connecter</Text>
                    </TouchableOpacity>

                    {/* Footer Link: Register */}
                    <TouchableOpacity
                        style={styles.footerLink}
                        onPress={handleRegister}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.footerText}>
                            Nouveau ici ? <Text style={styles.footerTextBold}>Créer un compte</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    headline: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subheadline: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        width: '100%',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        paddingVertical: 18,
        borderRadius: 16,
        width: '100%',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    footerLink: {
        marginTop: 8,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: COLORS.textSecondary,
    },
    footerTextBold: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});
