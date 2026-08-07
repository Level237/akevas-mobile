import { COLORS } from '@/constants/colors';
import { useAppDispatch } from '@/hooks/hooks';
import {
    useCheckIfEmailExistsMutation,
    useGetQuartersQuery,
    useGetTownsQuery,
    useLoginMutation,
    useRegisterMutation
} from '@/services/guardService';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
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
import { setCredentials } from '../authSlice';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    const [checkIfEmailExists] = useCheckIfEmailExistsMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [login] = useLoginMutation();

    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data: townsData } = useGetTownsQuery(undefined);
    const { data: quartersData, isLoading: quartersLoading } = useGetQuartersQuery(undefined);

    const towns = townsData?.data ?? townsData ?? [];
    const quarters = quartersData?.data ?? quartersData ?? [];

    const [selectedTown, setSelectedTown] = useState<{ id: string | number; name: string } | null>(null);
    const [selectedQuarter, setSelectedQuarter] = useState<{ id: string | number; name: string } | null>(null);
    const [isTownModalVisible, setIsTownModalVisible] = useState(false);
    const [isQuarterModalVisible, setIsQuarterModalVisible] = useState(false);

    const filteredQuarters = useMemo(() => {
        if (!selectedTown) return [];
        return quarters.filter((q: any) => q.town_id === selectedTown.id || q.town_name === selectedTown.name);
    }, [selectedTown, quarters]);

    const handleContinue = async () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Erreur', 'Veuillez saisir une adresse email valide.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await checkIfEmailExists({ email }).unwrap();
            if (res.status === "success") {
                setShow(true);
            }
        } catch (error: any) {
            Alert.alert('Erreur', error?.data?.message || 'Cet email est déjà utilisé.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (userName.trim().length < 3) {
            Alert.alert('Erreur', 'Le nom d\'utilisateur doit contenir au moins 3 caractères.');
            return;
        }
        if (phone.trim().length < 8) {
            Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone valide.');
            return;
        }
        if (!selectedTown || !selectedQuarter) {
            Alert.alert('Erreur', 'Veuillez sélectionner votre ville et votre quartier.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            await register({
                userName,
                email,
                phone_number: phone,
                password,
                town_id: selectedTown.id,
                residence: selectedQuarter.id,
            }).unwrap();

            const token = await SecureStore.getItemAsync('EXPO_PUSH_TOKEN');
            const loginRes: any = await login({
                phone_number: phone,
                password,
                role_id: 3,
                expo_push_token: token,
            });

            if (loginRes?.error) {
                router.replace('/(auth)/login');
                return;
            }

            await SecureStore.setItemAsync('access_token', loginRes.data.data.access_token);
            dispatch(setCredentials({ user: loginRes.data.data.user }));
            router.replace('/(home)');
        } catch (error: any) {
            Alert.alert('Erreur', 'Ce numéro de téléphone est deja utilisé');
        }
    };

    const handleLogin = () => {
        router.push('/(auth)/login');
    };

    const renderTownItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
                setSelectedTown({ id: item.id, name: item.town_name || item.name });
                setSelectedQuarter(null);
                setIsTownModalVisible(false);
            }}
        >
            <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.optionIcon} />
            <Text style={styles.optionText}>{item.town_name || item.name}</Text>
            {selectedTown?.name === (item.town_name || item.name) && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            )}
        </TouchableOpacity>
    );

    const renderQuarterItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
                setSelectedQuarter({ id: item.id, name: item.quarter_name || item.name });
                setIsQuarterModalVisible(false);
            }}
        >
            <Ionicons name="navigate-outline" size={20} color={COLORS.primary} style={styles.optionIcon} />
            <View style={{ flex: 1 }}>
                <Text style={styles.optionText}>{item.quarter_name || item.name}</Text>
                <Text style={styles.optionSubtext}>{item.town_name}</Text>
            </View>
            {selectedQuarter?.name === (item.quarter_name || item.name) && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            )}
        </TouchableOpacity>
    );

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
                <View style={styles.overlay} />

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* --- Section Inférieure : Formulaire --- */}
            <View style={styles.bottomSection}>
                {!show ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
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

                        <TouchableOpacity style={styles.googleButton} activeOpacity={0.7}>
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.loginText}>Se connecter</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
                    >
                        <Text style={styles.title}>Complétez vos informations</Text>
                        <Text style={styles.description}>
                            Dernière étape pour créer votre compte sur Akevas
                        </Text>

                        {/* Nom d'utilisateur */}
                        <Text style={styles.fieldLabel}>Nom d'utilisateur</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Entrez votre nom d'utilisateur"
                                placeholderTextColor="#9CA3AF"
                                value={userName}
                                onChangeText={setUserName}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Téléphone */}
                        <Text style={styles.fieldLabel}>Numéro de téléphone</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Entrez votre numéro de téléphone"
                                placeholderTextColor="#9CA3AF"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Ville */}
                        <Text style={styles.fieldLabel}>Ville</Text>
                        <TouchableOpacity
                            style={styles.selectContainer}
                            onPress={() => setIsTownModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="location-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <Text style={[styles.selectText, !selectedTown && { color: '#9CA3AF' }]}>
                                {selectedTown ? selectedTown.name : 'Sélectionnez votre ville'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Quartier */}
                        <Text style={styles.fieldLabel}>Quartier</Text>
                        <TouchableOpacity
                            style={styles.selectContainer}
                            onPress={() => setIsQuarterModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="map-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <Text style={[styles.selectText, !selectedQuarter && { color: '#9CA3AF' }]}>
                                {selectedQuarter ? selectedQuarter.name : 'Sélectionnez votre quartier'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Mot de passe */}
                        <Text style={styles.fieldLabel}>Mot de passe</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Minimum 6 caractères"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Confirmer mot de passe */}
                        <Text style={styles.fieldLabel}>Confirmer le mot de passe</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmez votre mot de passe"
                                placeholderTextColor="#9CA3AF"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryButton, styles.submitButton, isRegistering && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={isRegistering}
                            activeOpacity={0.8}
                        >
                            {isRegistering ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Créer mon compte</Text>
                            )}
                        </TouchableOpacity>

                        <ButtonRow onLogin={handleLogin} />
                    </ScrollView>
                )}
            </View>

            {/* Modal Ville */}
            <Modal
                visible={isTownModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setIsTownModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingTop: insets.top + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choisir une ville</Text>
                            <TouchableOpacity onPress={() => setIsTownModalVisible(false)} style={styles.modalCloseBtn}>
                                <Ionicons name="close" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={towns}
                            keyExtractor={(item: any) => item.id?.toString()}
                            renderItem={renderTownItem}
                            ListEmptyComponent={
                                <View style={styles.emptyResults}>
                                    <Text style={styles.emptyText}>Aucune ville trouvée</Text>
                                </View>
                            }
                            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal Quartier */}
            <Modal
                visible={isQuarterModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setIsQuarterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingTop: insets.top + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choisir un quartier</Text>
                            <TouchableOpacity onPress={() => setIsQuarterModalVisible(false)} style={styles.modalCloseBtn}>
                                <Ionicons name="close" size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>
                        {quartersLoading ? (
                            <ActivityIndicator color={COLORS.primary} style={{ padding: 24 }} />
                        ) : (
                            <FlatList
                                data={filteredQuarters}
                                keyExtractor={(item: any) => item.id?.toString()}
                                renderItem={renderQuarterItem}
                                ListEmptyComponent={
                                    <View style={styles.emptyResults}>
                                        <Text style={styles.emptyText}>
                                            {selectedTown ? 'Aucun quartier trouvé pour cette ville' : 'Sélectionnez d\'abord une ville'}
                                        </Text>
                                    </View>
                                }
                                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const ButtonRow = ({ onLogin }: { onLogin: () => void }) => (
    <View style={styles.footer}>
        <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
        <TouchableOpacity onPress={onLogin}>
            <Text style={styles.loginText}>Se connecter</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    topSection: {
        height: height * 0.3,
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
        backgroundColor: 'rgba(0,0,0,0.15)',
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
        marginTop: -40,
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
        marginBottom: 24,
        paddingHorizontal: 16,
        lineHeight: 22,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        height: '100%',
    },
    selectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 16,
    },
    selectText: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    eyeButton: {
        padding: 8,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
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
    submitButton: {
        marginTop: 8,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
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

    /* Modal styles */
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        height: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    optionIcon: {
        marginRight: 12,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    optionSubtext: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    emptyResults: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
});