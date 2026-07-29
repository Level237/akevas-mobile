import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        if (!email.trim() || !email.includes('@')) {
            // Simple validation
            return;
        }
        setIsLoading(true);
        // Simulation d'un délai réseau pour passer à l'étape suivante
        setTimeout(() => {
            setIsLoading(false);
            console.log("Email validé :", email);
            // TODO: Passer à l'étape 2 (Mot de passe, téléphone, etc.)
        }, 1000);
    };

    const handleLogin = () => {
        router.push('/(auth)/login');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar style="light" />


            {/* --- Section Supérieure : Image et Fond --- */}
            <View style={[styles.topSection, { paddingTop: insets.top }]}>
                <Image
                    source={require('@/assets/images/register.jpg')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
                {/* Dégradé optionnel pour mieux voir la flèche (si l'image est claire) */}
                <View style={styles.overlay} />

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* --- Section Inférieure : Formulaire --- */}
            <View style={styles.bottomSection}>
                <Text style={styles.title}>Créer un compte</Text>
                <Text style={styles.description}>
                    Saisissez votre adresse email pour démarrer votre aventure
                </Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Adresse email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.primaryButton, (!email || !email.includes('@')) && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={!email || !email.includes('@') || isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Continuer</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.divider} />
                </View>

                {/* Social Buttons */}
                <TouchableOpacity style={styles.googleButton} activeOpacity={0.7}>
                    {/* Simple G placeholder or Google image */}
                    <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }}
                        style={styles.googleIcon}
                    />
                    <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                </TouchableOpacity>



                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.loginText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Fond neutre, pas de bleu
    },
    topSection: {
        height: height * 0.45,
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.15)', // Légère ombre pour faire ressortir le bouton retour
    },
    backButton: {
        marginTop: 10,
        marginLeft: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        flex: 1,
        marginTop: -40, // Permet à la carte de remonter et couvrir le bas de l'image
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 28,
        paddingTop: 40,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 16,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Soft grey, no border for a cleaner look
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 24,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        height: '100%',
    },
    primaryButton: {
        backgroundColor: COLORS.primary, // Orange Akevas pour le bouton d'action
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        height: 60,
        borderRadius: 16,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    googleButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    socialButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto', // Pousse le footer vers le bas si l'écran est très grand
        paddingTop: 16,
    },
    footerText: {
        fontSize: 15,
        color: '#6B7280',
    },
    loginText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 6,
    },
});
