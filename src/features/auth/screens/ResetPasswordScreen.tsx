import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useResetPasswordMutation } from '@/services/guardService';

const COLORS = {
    primary: '#ed7e0f',
    background: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    surface: '#f5f5f5',
    border: '#E5E7EB',
    error: '#EF4444',
};

type Props = {
    email: string;
    temp_token: string;
};

const ResetPasswordScreen = ({ email, temp_token }: Props) => {
    const insets = useSafeAreaInsets();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmFocused, setIsConfirmFocused] = useState(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const passwordsMatch = password && confirmPassword && password === confirmPassword;
    const canSubmit = password.length >= 8 && passwordsMatch;

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        try {
            await resetPassword({
                email,
                password,
                temp_token,
                password_confirmation: confirmPassword,
            }).unwrap();
            Alert.alert(
                'Succès',
                'Votre mot de passe a été réinitialisé avec succès.',
                [{ text: 'Se connecter', onPress: () => router.replace('/(auth)/login') }]
            );
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
                    { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 40) },
                ]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft size={22} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Lock size={36} color={COLORS.primary} />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>Nouveau mot de passe</Text>
                <Text style={styles.subtitle}>
                    Définissez un nouveau mot de passe pour votre compte{'\n'}
                    <Text style={styles.emailHighlight}>{email}</Text>
                </Text>

                {/* New Password */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Nouveau mot de passe</Text>
                    <View style={[styles.inputContainer, isPasswordFocused && styles.inputContainerFocused]}>
                        <Lock
                            size={20}
                            color={isPasswordFocused ? COLORS.primary : '#9CA3AF'}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Entrez votre nouveau mot de passe"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                            {showPassword ? (
                                <EyeOff size={20} color="#6B7280" />
                            ) : (
                                <Eye size={20} color="#6B7280" />
                            )}
                        </TouchableOpacity>
                    </View>
                    {password.length > 0 && password.length < 8 && (
                        <Text style={styles.hintText}>Au moins 8 caractères</Text>
                    )}
                </View>

                {/* Confirm Password */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Confirmer le mot de passe</Text>
                    <View style={[
                        styles.inputContainer,
                        isConfirmFocused && styles.inputContainerFocused,
                        confirmPassword.length > 0 && password !== confirmPassword && styles.inputContainerError,
                    ]}>
                        <Lock
                            size={20}
                            color={isConfirmFocused ? COLORS.primary : '#9CA3AF'}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmez votre nouveau mot de passe"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onFocus={() => setIsConfirmFocused(true)}
                            onBlur={() => setIsConfirmFocused(false)}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)} style={styles.eyeButton}>
                            {showConfirmPassword ? (
                                <EyeOff size={20} color="#6B7280" />
                            ) : (
                                <Eye size={20} color="#6B7280" />
                            )}
                        </TouchableOpacity>
                    </View>
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                        <Text style={styles.errorText}>Les mots de passe ne correspondent pas</Text>
                    )}
                </View>

                {/* Submit */}
                <TouchableOpacity
                    style={[styles.submitButton, (!canSubmit || isLoading) && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!canSubmit || isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Réinitialiser le mot de passe</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 28,
    },
    header: {
        marginBottom: 32,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 28,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#FFF4E6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 36,
    },
    emailHighlight: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 16,
        height: 60,
        paddingHorizontal: 16,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
    },
    inputContainerError: {
        borderColor: COLORS.error,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    eyeButton: {
        padding: 8,
    },
    hintText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
        marginLeft: 4,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#fcdcb8',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});
