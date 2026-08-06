import { User as UserType } from '@/features/auth/authSlice';
import { openWebLink } from '@/utils/openWebLink';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ChevronRight,
    FileText,
    Heart,
    Info,
    LogOut,
    Settings as SettingsIcon,
    ShieldCheck,
    ShoppingCart,
    User
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthenticatedProfileViewProps = {
    user: UserType | null;
    onLogout: () => void;
};

const MenuItem = React.memo(({ icon: Icon, title, subtitle, onPress, showChevron = true, destructive = false }: any) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[styles.menuIconContainer, destructive && styles.destructiveIconContainer]}>
            <Icon size={22} color={destructive ? '#EF4444' : '#4B5563'} />
        </View>
        <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, destructive && styles.destructiveText]}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        {showChevron && <ChevronRight size={18} color="#9CA3AF" />}
    </TouchableOpacity>
));

const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};

const AuthenticatedProfileView = ({ user, onLogout }: AuthenticatedProfileViewProps) => {
    const insets = useSafeAreaInsets();
    const initials = useMemo(() => getInitials(user?.name), [user?.name]);

    const router = useRouter()
    return (
        <View style={styles.container}>
            {/* Modern Header with Gradient */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={['#E67E22', '#F39C12']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.headerGradient, { height: 200 + insets.top }]}
                />

                <View style={[styles.headerContent, { paddingTop: insets.top + 20 }]}>


                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{initials}</Text>
                            <View style={styles.onlineBadge} />
                        </View>
                        <View style={styles.userTextContainer}>
                            <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
                            <Text style={styles.userHandle}>Compte client</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Content Body */}
            <View style={styles.body}>
                {/* Stats / Metrics Grid */}


                {/* Liens Rapides Section */}

                {/* Account Actions */}
                <View style={styles.section}>

                    <View style={styles.menuCard}>
                        <MenuItem icon={User} title="Informations Personnelles" />
                        <MenuItem icon={ShoppingCart} title="Mes Commandes" onPress={() => router.push('/orders')} />
                        <MenuItem icon={Heart} title="Ma liste" onPress={() => router.push('/(home)/wishlist')} />

                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Préférences & Aide</Text>
                    <View style={styles.menuCard}>
                        <MenuItem icon={SettingsIcon} title="Mes préférences" onPress={() => router.push('/(navigation)/preferences')} />

                        <MenuItem icon={FileText} title="Contactez nous" onPress={() => openWebLink('https://akevas.com/contact')} />
                        <MenuItem icon={ShieldCheck} title="Confidentialité" onPress={() => openWebLink('https://akevas.com/privacy-policy')} />
                        <MenuItem icon={Info} title="Mention legales" onPress={() => openWebLink('https://akevas.com/legal-terms')} />
                    </View>
                </View>

                {/* Logout Button */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon={LogOut}
                            title="Se déconnecter"
                            onPress={onLogout}
                            showChevron={false}
                            destructive={true}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerContainer: {
        position: 'relative',
        width: '100%',
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        paddingHorizontal: 24,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#E67E22',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#10B981',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    userTextContainer: {
        marginLeft: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    userHandle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
        fontWeight: '600',
    },
    body: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },

    metricIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    metricLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    quickLinksSection: {
        marginBottom: 24,
        marginTop: -15,
    },
    quickLinksList: {
        paddingVertical: 8,
        paddingRight: 20,
    },


    quickLinkTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    quickLinkSubtitle: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 2,
    },
    section: {
        marginBottom: 24,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
        marginLeft: 4,
    },
    menuCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    destructiveIconContainer: {
        backgroundColor: '#FEF2F2',
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    destructiveText: {
        color: '#EF4444',
    },
});

export default React.memo(AuthenticatedProfileView);
