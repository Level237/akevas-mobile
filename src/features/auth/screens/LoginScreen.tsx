import { images } from '@/constants/images';
import { useCheckIfPhoneExistsMutation } from '@/services/guardService';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginForm from '../forms/LoginForm';

// Using a clean white UI inspired by WelcomeScreen
const COLORS = {
    primary: '#ed7e0f',
    background: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    surface: '#f5f5f5',
    border: '#E5E7EB',
};

const { width } = Dimensions.get('window');


const LoginScreen = () => {
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);
    const [checkIfPhoneExists] = useCheckIfPhoneExistsMutation();
    const handleLogin = (phone: string, pass: string) => {
        setIsLoading(true);
        // Simulation d'une requête de connexion
        setTimeout(() => {
            setIsLoading(false);
            console.log('Login success for', phone);
            // Redirection après connexion réussie
            // router.replace('/(home)');
        }, 1500);
    };

    const handleVerifyPhone = async (phone: string) => {
        setIsLoading(true);
        const response = await checkIfPhoneExists(phone).unwrap();
        console.log(response);

        if (response.code === "404") {
            setTimeout(() => {
                setIsLoading(false);
                return "404";
            }, 1500);
        } else {
            setTimeout(() => {
                setIsLoading(false);
                return "200";
            }, 1500);
        }

    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Navigation */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    <Image
                        source={images.logo} // Utilisation de l'image de welcome1 pour varier un peu
                        style={styles.illustration}
                        contentFit="contain"
                    />
                </View>

                {/* Main Content */}
                <View style={styles.formSection}>
                    <LoginForm onSubmit={handleLogin} isLoading={isLoading} checkIfEmailExists={handleVerifyPhone} />

                    {/* Social Login Section */}
                    <View style={styles.socialSection}>
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>Ou connectez-vous avec</Text>
                            <View style={styles.divider} />
                        </View>

                        <TouchableOpacity style={styles.googleButton} activeOpacity={0.7}>
                            {/* Simple G placeholder or Google image */}
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer Register Link */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Pas encore de compte ?</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => console.log('Aller à la page inscription')}
                    >
                        <Text style={styles.footerLink}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        width: '100%',
        height: width * 0.2, // Hauteur proportionnelle
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    formSection: {
        flex: 1,
    },
    socialSection: {
        marginTop: 40,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        color: COLORS.textSecondary,
        paddingHorizontal: 16,
        fontSize: 13,
        fontWeight: '600',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        height: 56,
        borderRadius: 16,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    googleButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '700',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 48,
        marginBottom: 16,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 15,
        fontWeight: '500',
        marginRight: 6,
    },
    footerLink: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: '700',
    },
});

export default LoginScreen;
