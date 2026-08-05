import { ArrowLeft, Mail } from 'lucide-react-native';
import { useRef, useState } from 'react';
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
import { useForgotPasswordMutation, useVerifyOtpMutation } from '@/services/guardService';

const COLORS = {
    primary: '#ed7e0f',
    background: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    surface: '#f5f5f5',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
};

const OTP_LENGTH = 6;

const maskEmail = (email: string) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    const maskedName =
        name.length > 4
            ? name.substring(0, 4) + '*'.repeat(name.length - 4)
            : name.substring(0, 1) + '*'.repeat(name.length - 1);
    return `${maskedName}@${domain}`;
};

type Props = {
    email: string;
};

const OtpVerificationScreen = ({ email }: Props) => {
    const insets = useSafeAreaInsets();
    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
    const inputs = useRef<(TextInput | null)[]>([]);

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
    const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

    const handleOtpChange = (text: string, index: number) => {
        // Handle paste of full code
        if (text.length > 1) {
            const digits = text.replace(/\D/g, '').split('').slice(0, OTP_LENGTH);
            const newOtp = new Array(OTP_LENGTH).fill('');
            digits.forEach((d, i) => { newOtp[i] = d; });
            setOtp(newOtp);
            inputs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
            return;
        }
        const cleaned = text.replace(/\D/g, '');
        const newOtp = [...otp];
        newOtp[index] = cleaned;
        setOtp(newOtp);
        if (cleaned && index < OTP_LENGTH - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputs.current[index - 1]?.focus();
        }
    };

    const otpCode = otp.join('');
    const isComplete = otpCode.length === OTP_LENGTH && otp.every(d => d !== '');

    const handleVerify = async () => {
        if (!isComplete) return;
        try {
            const res = await verifyOtp({ email, otp: otpCode }).unwrap();
            if (res.temp_token) {
                router.replace({
                    pathname: '/(auth)/reset-password' as any,
                    params: { email, temp_token: res.temp_token },
                });
            } else {
                Alert.alert('Erreur', 'Réponse inattendue du serveur.');
            }
        } catch (error: any) {
            Alert.alert('Code incorrect', error?.data?.message || 'Le code est invalide ou expiré.');
        }
    };

    const handleResend = async () => {
        try {
            await forgotPassword({ email }).unwrap();
            Alert.alert('Succès', 'Un nouveau code a été envoyé à votre adresse email.');
        } catch (error: any) {
            Alert.alert('Erreur', error?.data?.message || 'Impossible de renvoyer le code.');
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
                        <Mail size={36} color={COLORS.primary} />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>Vérification OTP</Text>
                <Text style={styles.subtitle}>
                    Entrez le code envoyé à{'\n'}
                    <Text style={styles.emailHighlight}>{maskEmail(email)}</Text>
                </Text>

                {/* OTP Inputs */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => { inputs.current[index] = ref; }}
                            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                            value={digit}
                            onChangeText={text => handleOtpChange(text, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                            keyboardType="number-pad"
                            maxLength={OTP_LENGTH}
                            selectTextOnFocus
                            textAlign="center"
                            autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        />
                    ))}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    style={[styles.submitButton, (!isComplete || isLoading) && styles.submitButtonDisabled]}
                    onPress={handleVerify}
                    disabled={!isComplete || isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Vérifier le code</Text>
                    )}
                </TouchableOpacity>

                {/* Resend */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Vous n'avez pas reçu le code ? </Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleResend}
                        disabled={isResending}
                    >
                        {isResending ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Text style={styles.resendLink}>Renvoyer le code</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default OtpVerificationScreen;

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
        marginBottom: 40,
    },
    emailHighlight: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 36,
        gap: 8,
    },
    otpInput: {
        flex: 1,
        height: 62,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 14,
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
        backgroundColor: COLORS.surface,
    },
    otpInputFilled: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFF4E6',
        color: COLORS.primary,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
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
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    resendLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});
