import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/hooks';
import { useLinkGooglePhoneMutation } from '@/services/guardService';
import * as SecureStore from 'expo-secure-store';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LinkGooglePhoneScreen() {
    const params = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [linkGooglePhone] = useLinkGooglePhoneMutation();

    const handleLink = async () => {
        if (phone.length < 8) {
            Alert.alert('Erreur', 'Numéro de téléphone invalide');
            return;
        }

        setIsLoading(true);
        try {
            const res = await linkGooglePhone({
                id_token: params.id_token as string,
                phone_number: phone,
                role_id: 3 // Client
            }).unwrap();

            const accessToken = res.access_token || res.data?.access_token;
            const userData = res.user || res.data?.user;

            if (accessToken) {
                await SecureStore.setItemAsync('access_token', accessToken);
            }

            if (userData) {
                dispatch(setCredentials({ user: userData }));
            }

            // Redirection vers l'écran demandé initialement, ou l'accueil
            const redirect = (params.redirect as string) || '/(home)';
            router.replace(redirect as any);

        } catch (error: any) {
            if (error.data?.message?.includes('unique') || error.data?.message?.includes('déjà')) {
                Alert.alert('Erreur', 'Ce numéro de téléphone est déjà utilisé par un autre compte.');
            } else {
                Alert.alert('Erreur', error.data?.message || 'Impossible de finaliser l\'inscription');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color="#111" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.container}>
                <Text style={styles.title}>Finaliser votre compte</Text>
                <Text style={styles.subtitle}>
                    Nous avons trouvé votre compte Google ({params.email}), mais nous avons besoin de votre numéro de téléphone pour finaliser votre inscription sur Akevas.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre numéro de téléphone"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <TouchableOpacity
                    style={[styles.button, (isLoading || phone.length < 8) && styles.buttonDisabled]}
                    onPress={handleLink}
                    disabled={isLoading || phone.length < 8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Continuer</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFF' },
    header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 12 },
    backButton: { 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        backgroundColor: '#F3F4F6', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', paddingBottom: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#111' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 32, lineHeight: 24 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 24, color: '#111' },
    button: { backgroundColor: '#ed7e0f', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
