import { COLORS } from '@/constants/colors';
import { selectCurrentUser, updateUser as updateUserInStore } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useUpdateUserMutation } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const ProfileField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}: FieldProps) => (
    <View style={styles.fieldGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
        />
    </View>
);

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    console.log("Current user in EditProfileScreen:", user);
    useEffect(() => {
        if (!user) return;

        setUserName(user.userName || user.name || '');
        setPhoneNumber(user.phone_number || '');
        setEmail(user.email || '');
    }, [user]);

    const handleSave = async () => {
        if (!userName.trim()) {
            Alert.alert('Erreur', 'Le nom d\'utilisateur est obligatoire.');
            return;
        }

        if (!phoneNumber.trim()) {
            Alert.alert('Erreur', 'Le numéro de téléphone est obligatoire.');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Erreur', 'Veuillez saisir une adresse email valide.');
            return;
        }

        try {
            const payload = {
                userName: userName.trim(),
                phone_number: phoneNumber.trim(),
                email: email.trim(),
            };

            await updateUser(payload).unwrap();

            dispatch(
                updateUserInStore({
                    name: userName.trim(),
                    userName: userName.trim(),
                    phone_number: phoneNumber.trim(),
                    email: email.trim(),
                })
            );

            Alert.alert('Succès', 'Votre profil a bien été mis à jour.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error: any) {
            console.error('Erreur mise à jour profil', error);
            Alert.alert(
                'Erreur',
                error?.data?.message || 'Impossible de mettre à jour votre profil pour le moment.'
            );
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Informations personnelles</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.card}>
                    <ProfileField
                        label="Nom complet"
                        value={userName}
                        onChangeText={setUserName}
                        placeholder="Saisissez votre nom"
                    />

                    <ProfileField
                        label="Téléphone"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Votre numéro"
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                    />

                    <ProfileField
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Votre adresse email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={isLoading}
                    activeOpacity={0.9}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Enregistrer</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    headerRight: {
        width: 32,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    fieldGroup: {
        marginBottom: 18,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 15,
        color: '#111827',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 28,
        backgroundColor: '#F9FAFB',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
});
