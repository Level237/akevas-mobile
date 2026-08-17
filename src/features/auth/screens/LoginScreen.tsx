import { images } from '@/constants/images';
import { useAppDispatch } from '@/hooks/hooks';
import { useCheckGoogleMutation, useCheckIfPhoneExistsMutation, useForgotPasswordMutation, useLoginMutation } from '@/services/guardService';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { setCredentials } from '../authSlice';
import LoginForm from '../forms/LoginForm';

import * as SecureStore from 'expo-secure-store';

import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Configuration initiale (à mettre AVANT le composant, au niveau du module)
GoogleSignin.configure({
    webClientId: '602337726747-jbkcik70np9fhvp9e30hvv7bsm6f4sh2.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    forceCodeForRefreshToken: false,
});

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
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [checkIfPhoneExists] = useCheckIfPhoneExistsMutation();
    const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();

    const params = useLocalSearchParams();
    const { redirect, ...restParams } = params;

    const [login, { isLoading: isLoadingLogin }] = useLoginMutation();
    const [checkGoogleLoginMutation] = useCheckGoogleMutation();

    // Initialisation au montage
    useEffect(() => {
        // Vérifie si un utilisateur est déjà connecté
        GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).then((hasServices) => {
            if (!hasServices) {
                console.log('Google Play Services non disponible');
            }
        }).catch((err) => {
            console.log('Erreur vérification Play Services', err);
        });
    }, []);

    const handleGoogleLogin = async () => {
        try {
            // 1. Sign out au cas où un utilisateur serait déjà connecté
            await GoogleSignin.signOut();

            // 2. Lancer le flow de connexion
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken || (userInfo as any).idToken;

            if (idToken) {
                await handleGoogleLoginSuccess(idToken);
            } else {

            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Connexion annulée par l\'utilisateur');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Connexion en cours');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Erreur', 'Google Play Services non disponible');
            } else {
                console.error('Erreur Google Sign-In:', error);
                Alert.alert('Erreur', 'Impossible de se connecter avec Google');
            }
        }
    };

    const handleGoogleLoginSuccess = async (idToken: string) => {
        try {
            setIsLoading(true);

            // 1. Appel à l'endpoint de vérification
            const res = await checkGoogleLoginMutation({ id_token: idToken }).unwrap();

            // 2. Si succès, on extrait les données de la structure standardisée
            const accessToken = res.data.access_token;
            const userData = res.data.user; // ✅ C'est ici que se trouvent les infos de l'utilisateur

            
            await SecureStore.setItemAsync('access_token', accessToken);
            dispatch(setCredentials({ user: userData }));

            // 4. Redirection intelligente
            if (redirect && typeof redirect === 'string') {
                router.replace({ pathname: redirect as any, params: restParams });
            } else {
                router.replace("/(home)");
            }

        } catch (error: any) {
            // Gestion des erreurs
            if (error.status === 404 && error.data?.status === 'needs_phone') {
                const userData = error.data.data; // Les données sont dans error.data.data ici à cause du format 404
                router.push({
                    pathname: '/(auth)/link-google-phone',
                    params: {
                        id_token: idToken,
                        email: userData.email,
                        name: userData.name,
                        redirect: redirect
                    }
                });
            }
            else if (error.status === 403 && error.data?.status === 'role_mismatch') {
                Alert.alert('Accès refusé', error.data?.message || 'Email professionnel non autorisé ici.');
            }
            else {
                Alert.alert('Erreur', 'Impossible de se connecter avec Google.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (phone: string, pass: string) => {
        setIsLoading(true);
        const token = await SecureStore.getItemAsync('EXPO_PUSH_TOKEN');
        const userObject = { phone_number: phone, password: pass, role_id: 3, expo_push_token: token };
        const res = await login(userObject);

        if (res?.error) {
            setIsLoading(false);
            // Optionnel : Afficher une alerte d'erreur ici
            console.error("Erreur de connexion", res.error);
            return;
        }

        // ✅ SUCCÈS DE LA CONNEXION
        try {
            // 1. Sauvegarder le token et mettre à jour Redux
            await SecureStore.setItemAsync('access_token', res.data.data.access_token);
            dispatch(setCredentials({ user: res.data.data.user }));

            // 2. 🚀 REDIRECTION INTELLIGENTE
            if (redirect && typeof redirect === 'string') {
                // On utilise 'replace' pour écraser l'écran de Login par l'écran de destination.
                // Ainsi, quand l'utilisateur appuiera sur "Retour", il reviendra à l'écran d'avant le Login.
                router.replace({
                    pathname: redirect as any,
                    params: restParams // On transmet TOUS les paramètres originaux (s, productIds, etc.)
                });
            } else {
                // Fallback par défaut si aucun redirect n'est spécifié
                router.replace("/(home)");
            }
        } catch (error) {
            console.error("Erreur lors de la redirection post-login:", error);
            setIsLoading(false);
        }
    };

    const handleVerifyPhone = async (phone: string) => {
        setIsLoading(true);
        const response = await checkIfPhoneExists({ phone: phone }).unwrap();
        if (response.code === "404") {
            setIsLoading(false);
            return "404"
        } else {
            setIsLoading(false);
            return "200";
        }

    };

    const handleForgotPassword = async () => {
        if (!resetEmail || !resetEmail.includes('@')) {
            Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
            return;
        }
        try {
            const res = await forgotPassword({ email: resetEmail }).unwrap();
            if (res.status === 200 || res.success) {
                setIsForgotPasswordVisible(false);
                setResetEmail('');
                router.push({
                    pathname: '/(auth)/forgot-password-otp' as any,
                    params: { email: resetEmail }
                });
            } else {
                Alert.alert('Erreur', 'Impossible d\'envoyer le code OTP.');
            }
        } catch (error: any) {
            Alert.alert('Erreur', error?.data?.message || 'Une erreur est survenue.');
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
                    <LoginForm
                        onSubmit={handleLogin}
                        isLoading={isLoading}
                        checkIfEmailExists={handleVerifyPhone}
                        onForgotPassword={() => setIsForgotPasswordVisible(true)}
                    />

                    {/* Social Login Section */}
                    <View style={styles.socialSection}>
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>Ou connectez-vous avec</Text>
                            <View style={styles.divider} />
                        </View>

                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={handleGoogleLogin}
                            activeOpacity={0.7}
                            disabled={isLoadingLogin}
                        >
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
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Text style={styles.footerLink}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Forgot Password Modal */}
            <Modal
                visible={isForgotPasswordVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setIsForgotPasswordVisible(false);
                    setResetEmail('');
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Mot de passe oublié</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsForgotPasswordVisible(false);
                                    setResetEmail('');
                                }}
                                style={styles.modalCloseButton}
                            >
                                <Text style={styles.modalCloseText}>Fermer</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            Entrez votre adresse email pour recevoir un code de réinitialisation.
                        </Text>

                        <View style={[
                            styles.modalInputContainer,
                            resetEmail.length > 0 && resetEmail.includes('@') && styles.modalInputContainerFocused
                        ]}>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Entrez votre adresse email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                value={resetEmail}
                                onChangeText={setResetEmail}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.modalSubmitButton,
                                (isForgotLoading || !resetEmail.includes('@')) && styles.modalSubmitButtonDisabled
                            ]}
                            onPress={handleForgotPassword}
                            disabled={isForgotLoading || !resetEmail.includes('@')}
                            activeOpacity={0.8}
                        >
                            {isForgotLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.modalSubmitButtonText}>Envoyer le code</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    modalCloseText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalSubtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginBottom: 24,
        lineHeight: 22,
    },
    modalInputContainer: {
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        height: 56,
        justifyContent: 'center',
    },
    modalInputContainerFocused: {
        borderColor: COLORS.primary,
    },
    modalInput: {
        fontSize: 16,
        color: COLORS.text,
    },
    modalSubmitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    modalSubmitButtonDisabled: {
        backgroundColor: '#fcdcb8',
        shadowOpacity: 0,
        elevation: 0,
    },
    modalSubmitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
