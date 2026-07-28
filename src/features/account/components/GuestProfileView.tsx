import { COLORS } from '@/constants/colors';
import { router } from 'expo-router';
import {
    BookOpen,
    ChevronRight,
    FileText,
    HelpCircle,
    Info,
    Lock,
    Settings,
    Shield,
    Store,
    User
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GuestProfileViewProps = {
    onLogin?: () => void;
    onRegister?: () => void;
};

type MenuItemProps = {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    isLocked?: boolean; // Pour indiquer qu'il faut être connecté
    isLast?: boolean;
};

const MenuItem = ({ icon: Icon, title, subtitle, onPress, isLocked, isLast }: MenuItemProps) => (
    <TouchableOpacity
        style={[styles.menuItem, !isLast && styles.menuItemBorder]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={title}
    >
        <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
                <Icon size={20} color={isLocked ? "#9CA3AF" : COLORS.primary} />
                {isLocked && <Lock size={12} color="#9CA3AF" style={styles.lockIcon} />}
            </View>
            <View>
                <Text style={[styles.menuItemText, isLocked && { color: '#9CA3AF' }]}>{title}</Text>
                {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
            </View>
        </View>
        <ChevronRight size={20} color="#D1D5DB" />
    </TouchableOpacity>
);

const GuestProfileView = ({ onLogin, onRegister }: GuestProfileViewProps) => {
    const insets = useSafeAreaInsets();

    const handleNavigate = (route: string) => {
        // Si l'action nécessite une connexion, on redirige vers le login
        // Sinon, on navigue normalement
        router.push(route as any);
    };

    return (
        <View style={styles.container}>
            {/* ✅ HEADER ROBUSTE : Centrage parfait garanti par flex: 1 */}


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={true}
            >
                {/* Profile Card */}
                <View style={styles.profileCardBg}>
                    <View style={styles.decorationCircle1} />
                    <View style={styles.decorationCircle2} />

                    <View style={styles.profileCardInner}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarContainer}>
                                <User size={20} color="#6B7280" />
                            </View>
                            <View>
                                <Text style={styles.guestName}>Visiteur</Text>
                                <Text style={styles.guestSub}>Connectez-vous pour une meilleure experience</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Section: Préférences (Locked for guests) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personnalisation</Text>
                    <View style={styles.sectionContent}>
                        <MenuItem
                            icon={Settings}
                            title="Mes préférences"
                            subtitle="Définissez vos centres d'intérêt"
                            onPress={() => router.push('/(navigation)/preferences')}
                            isLast
                        />
                    </View>
                </View>

                {/* Section: Découvrir Akevas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Découvrir Akevas</Text>
                    <View style={styles.sectionContent}>
                        <MenuItem icon={Info} title="À propos de nous" onPress={() => handleNavigate('/about')} />
                        <MenuItem icon={BookOpen} title="Comment ça marche ?" onPress={() => handleNavigate('/how-it-works')} />
                        <MenuItem icon={Store} title="Devenir vendeur" onPress={() => handleNavigate('/(auth)/register?role=seller')} isLast />
                    </View>
                </View>

                {/* Section: Assistance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Assistance</Text>
                    <View style={styles.sectionContent}>
                        <MenuItem icon={HelpCircle} title="Centre d'aide & FAQ" onPress={() => handleNavigate('/help')} />
                        <MenuItem icon={User} title="Nous contacter" onPress={() => handleNavigate('/contact')} isLast />
                    </View>
                </View>

                {/* Section: Légal & Sécurité */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Légal & Données</Text>
                    <View style={styles.sectionContent}>
                        <MenuItem icon={Shield} title="Politique de confidentialité" onPress={() => handleNavigate('/privacy')} />
                        <MenuItem icon={FileText} title="Conditions générales" onPress={() => handleNavigate('/terms')} isLast />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA', // Fond légèrement grisé pour faire ressortir les cartes blanches
    },
    // --- HEADER ---


    // --- SCROLL ---
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    // --- PROFILE CARD ---
    profileCardBg: {

        borderRadius: 24,
        padding: 2, // Petite bordure intérieure
        marginTop: 16,
        marginBottom: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    decorationCircle1: {
        position: 'absolute',
        top: -30,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    decorationCircle2: {
        position: 'absolute',
        bottom: -20,
        left: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    profileCardInner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 30,
        height: 30,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    guestName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    guestSub: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    // --- SECTIONS ---
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        position: 'relative',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    lockIcon: {
        position: 'absolute',
        bottom: -2,
        right: -4,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 1,
    },
    menuItemText: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
    },
    menuItemSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
});

export default React.memo(GuestProfileView);