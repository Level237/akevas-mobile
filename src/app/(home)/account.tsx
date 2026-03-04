import {
    CreditCard,
    FileText,
    Globe,
    Info,
    LogOut,
    Phone,
    ShieldCheck,
    User
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountListItem, AccountSection } from '../../features/account/components/AccountListComponents';
import GuestProfileView from '../../features/account/components/GuestProfileView';
import ProfileHero from '../../features/account/components/ProfileHero';
import SocialMetricsBar from '../../features/account/components/SocialMetricsBar';

// Redux
import { logout, selectIsAuthenticated } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const handleLogout = () => {
        dispatch(logout());
        // Optionnellement naviguer vers l'accueil ou rester ici pour voir la vue Guest
    };

    const handleLogin = () => {
        // Rediriger vers l'écran de login
        // router.push('/(auth)/login'); 
        console.log("Navigate to login");
    };

    const handleRegister = () => {
        // Rediriger vers l'écran d'inscription
        // router.push('/(auth)/register');
        console.log("Navigate to register");
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 100 }
                ]}
            >
                {isAuthenticated ? (
                    <>
                        {/* Immersive Social Hero for logged in users */}
                        <ProfileHero
                            onSettings={() => console.log("Settings")}
                            onEditProfile={() => console.log("Edit Profile")}
                        />

                        {/* Social Metrics */}
                        <SocialMetricsBar />

                        {/* Account Section - Only for logged in */}
                        <AccountSection title="Compte">
                            <AccountListItem
                                icon={User}
                                title="Informations Personnelles"
                            />
                            <AccountListItem
                                icon={CreditCard}
                                title="Documents de Paiement"
                            />
                        </AccountSection>

                        <AccountSection title="Paramètres">
                            <AccountListItem
                                icon={Globe}
                                title="Langue"
                                subtitle="Français"
                            />
                            <AccountListItem
                                icon={FileText}
                                title="Conditions d'utilisation"
                            />
                            <AccountListItem
                                icon={ShieldCheck}
                                title="Politique de Confidentialité"
                            />
                        </AccountSection>

                        {/* Support Section */}
                        <AccountSection title="Support">
                            <AccountListItem
                                icon={Info}
                                title="À propos d'Akevas"
                            />
                            <AccountListItem
                                icon={Phone}
                                title="Nous contacter"
                            />
                            {isAuthenticated && (
                                <AccountListItem
                                    icon={LogOut}
                                    title="Se déconnecter"
                                    onPress={handleLogout}
                                    showChevron={false}
                                />
                            )}
                        </AccountSection>
                    </>
                ) : (
                    <GuestProfileView
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                    />
                )}

                {/* Common Sections (Visible to both or restricted?) */}
                {/* Usually Settings and Support remain visible */}


            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        paddingTop: 0,
    },
});