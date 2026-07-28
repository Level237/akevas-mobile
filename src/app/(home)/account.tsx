import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';

import AuthenticatedProfileView from '../../features/account/components/AuthenticatedProfileView';
import GuestProfileView from '../../features/account/components/GuestProfileView';

// Redux
import { logout, selectCurrentUser, selectIsAuthenticated } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useLogoutMutation } from '@/services/authService';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const [logoutUser] = useLogoutMutation();
    const handleLogout = async () => {
        dispatch(logout());
        await logoutUser("Auth");
        router.replace('/welcome');
    };

    const handleLogin = () => {
        router.push('/(auth)/login');
    };

    const handleRegister = () => {
        console.log("Navigate to register");
    };

    return (
        <View style={styles.container}>

            <View style={[styles.headerBar, { paddingTop: insets.top + 12 }]}>
                <View style={styles.headerLeft}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.headerTitle}>Profil</Text>
                <View style={styles.headerRight}>
                    {!isAuthenticated && (
                        <TouchableOpacity style={styles.headerLoginBtn} onPress={handleLogin}>
                            <Text style={styles.headerLoginText}>Se connecter</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
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

    headerLeft: {
        flex: 1, // Prend tout l'espace disponible à gauche
        alignItems: 'flex-start',
    },
    headerRight: {
        flex: 1, // Prend tout l'espace disponible à droite (équilibre le titre)
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerLoginBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    headerLoginText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        // Le titre est naturellement centré grâce aux flex: 1 de gauche et droite
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    logo: {
        width: 46,
        height: 46,
    },

    scrollContent: {
        paddingTop: 0,
    },
});