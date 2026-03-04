import { ArrowLeft, Eye, EyeOff, Lock, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type LoginFormProps = {
    onSubmit: (phone: string, pass: string) => void;
    isLoading?: boolean;
    checkIfEmailExists: (phone: string) => Promise<any>;
};

const COLORS = {
    primary: '#ed7e0f',
    background: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    surface: '#f5f5f5',
    border: '#E5E7EB',
};

const LoginForm = ({ onSubmit, isLoading, checkIfEmailExists }: LoginFormProps) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [error, setError] = useState("")
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const handleContinue = async () => {
        if (phone.length >= 8) {
            const response = await checkIfEmailExists(phone);
            if (response?.code === "200") {
                setStep(2);
            } else {
                setError("Aucun numéro n'est associé à ce numéro.");
            }
        }

    };

    const handleSubmit = () => {
        if (phone && password) {
            onSubmit(phone, password);
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 ? (
                <View style={styles.stepContainer}>
                    <Text style={styles.title}>Quel est votre numéro ?</Text>
                    <Text style={styles.subtitle}>Nous allons vérifier si vous avez un compte existant sur Akevas.</Text>

                    <View style={styles.inputGroup}>
                        <View style={[
                            styles.inputContainer,
                            isPhoneFocused && styles.inputContainerFocused
                        ]}>
                            <Phone size={20} color={isPhoneFocused ? COLORS.primary : "#9CA3AF"} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="06 12 34 56 78"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={(text) => {
                                    setPhone(text);
                                    setError("");
                                }}
                                onFocus={() => setIsPhoneFocused(true)}
                                onBlur={() => setIsPhoneFocused(false)}
                                autoCapitalize="none"
                                autoFocus
                            />

                        </View>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!phone || phone.length < 8) && styles.submitButtonDisabled
                        ]}
                        onPress={handleContinue}
                        disabled={!phone || phone.length < 8}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitButtonText}>{isLoading ? <ActivityIndicator color={COLORS.background} /> : "Continuer"}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.stepContainer}>
                    <TouchableOpacity onPress={() => setStep(1)} style={styles.headerBack}>
                        <ArrowLeft size={16} color={COLORS.textSecondary} />
                        <Text style={styles.headerBackText}>{phone}</Text>
                        <Text style={styles.headerBackEdit}>Modifier</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Entrez votre mot de passe</Text>
                    <Text style={styles.subtitle}>Pour sécuriser l'accès à votre compte.</Text>

                    <View style={styles.inputGroup}>
                        <View style={[
                            styles.inputContainer,
                            isPasswordFocused && styles.inputContainerFocused
                        ]}>
                            <Lock size={20} color={isPasswordFocused ? COLORS.primary : "#9CA3AF"} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Votre mot de passe"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!isPasswordVisible}
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                autoCapitalize="none"
                                autoFocus
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                style={styles.eyeIcon}
                            >
                                {isPasswordVisible ? (
                                    <EyeOff size={20} color="#6B7280" />
                                ) : (
                                    <Eye size={20} color="#6B7280" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (!password || isLoading) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!password || isLoading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    stepContainer: {
        width: '100%',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginBottom: 32,
        lineHeight: 22,
    },
    headerBack: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 24,
    },
    headerBackText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 14,
    },
    headerBackEdit: {
        color: COLORS.primary,
        fontWeight: '700',
        marginLeft: 8,
        fontSize: 13,
    },
    inputGroup: {
        marginBottom: 20,
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
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 32,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    submitButton: {
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
    errorText: {
        color: "red",
        fontSize: 14,
        fontWeight: '700',
        marginTop: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#fcdcb8',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
    },
});

export default LoginForm;
