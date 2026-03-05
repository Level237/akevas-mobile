import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthenticatedProfileView from '../../features/account/components/AuthenticatedProfileView';
import GuestProfileView from '../../features/account/components/GuestProfileView';

// Redux
import { logout, selectCurrentUser, selectIsAuthenticated } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);

    const handleLogout = () => {
        dispatch(logout());
        // Optionnellement naviguer vers l'accueil ou rester ici pour voir la vue Guest
    };

    const handleLogin = () => {
        router.push('/(auth)/login');
    };

    const handleRegister = () => {
        console.log("Navigate to register");
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 }
                ]}
                bounces={isAuthenticated ? false : true}
            >
                {isAuthenticated ? (
                    <AuthenticatedProfileView
                        user={user}
                        onLogout={handleLogout}
                    />
                ) : (
                    <GuestProfileView
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Fond gris très clair pour plus de modernité
    },
    scrollContent: {
        paddingTop: 0,
    },
});