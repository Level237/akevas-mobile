import { User as UserType } from '@/features/auth/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import {
    BarChart3,
    ChevronRight,
    CreditCard,
    FileText,
    Gift,
    Globe,
    Heart,
    Info,
    LogOut,
    Package,
    Phone,
    Receipt,
    Settings as SettingsIcon,
    ShieldCheck,
    Store,
    User
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type AuthenticatedProfileViewProps = {
    user: UserType | null;
    onLogout: () => void;
};

const QUICK_LINKS = [
    {
        id: 'orders',
        icon: Package,
        title: 'Commandes',
        subtitle: 'Suivi & colis',
        color: '#E67E22',
        bgColor: '#FFF7ED',
    },
    {
        id: 'transactions',
        icon: Receipt,
        title: 'Transactions',
        subtitle: 'Historique',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
    },
    {
        id: 'stats',
        icon: BarChart3,
        title: 'Statistiques',
        subtitle: 'Mes activités',
        color: '#10B981',
        bgColor: '#ECFDF5',
    },
    {
        id: 'wishlist',
        icon: Heart,
        title: 'Ma Liste',
        subtitle: 'Coups de coeur',
        color: '#EC4899',
        bgColor: '#FDF2F8',
    },
    {
        id: 'stores',
        icon: Store,
        title: 'Boutiques',
        subtitle: 'Mes suivis',
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
    },
    {
        id: 'referral',
        icon: Gift,
        title: 'Parrainage',
        subtitle: 'Gagner des coins',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
    },
];

const QuickLinkItem = React.memo(({ item }: { item: typeof QUICK_LINKS[0] }) => {
    const Icon = item.icon;
    return (
        <TouchableOpacity style={styles.quickLinkCard} activeOpacity={0.7}>
            <View style={[styles.quickLinkIconContainer, { backgroundColor: item.bgColor }]}>
                <Icon size={22} color={item.color} strokeWidth={2.5} />
            </View>
            <Text style={styles.quickLinkTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.quickLinkSubtitle} numberOfLines={1}>{item.subtitle}</Text>
        </TouchableOpacity>
    );
});

const MetricItem = React.memo(({ icon: Icon, label, value, color }: any) => (
    <View style={styles.metricCard}>
        <View style={[styles.metricIconContainer, { backgroundColor: `${color}15` }]}>
            <Icon size={20} color={color} />
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
    </View>
));

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
    const initials = useMemo(() => getInitials(user?.userName), [user?.userName]);

    const renderQuickLink = ({ item }: { item: typeof QUICK_LINKS[0] }) => (
        <QuickLinkItem item={item} />
    );

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
                    <View style={styles.headerTopRow}>
                        <Text style={styles.headerTitle}>Mon Profil</Text>
                        <TouchableOpacity style={styles.settingsButton}>
                            <SettingsIcon size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{initials}</Text>
                            <View style={styles.onlineBadge} />
                        </View>
                        <View style={styles.userTextContainer}>
                            <Text style={styles.userName}>{user?.userName || 'Utilisateur'}</Text>
                            <Text style={styles.userHandle}>ID: #AKV-{user?.id || '0000'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Content Body */}
            <View style={styles.body}>
                {/* Stats / Metrics Grid */}


                {/* Liens Rapides Section */}
                <View style={styles.quickLinksSection}>

                    <FlatList
                        data={QUICK_LINKS}
                        renderItem={renderQuickLink}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickLinksList}
                        snapToInterval={width * 0.38 + 12}
                        decelerationRate="fast"
                    />
                </View>

                {/* Account Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Compte</Text>
                    <View style={styles.menuCard}>
                        <MenuItem icon={User} title="Informations Personnelles" />
                        <MenuItem icon={CreditCard} title="Mes Méthodes de Paiement" />
                        <MenuItem icon={Phone} title="Sécurité du compte" />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Préférences & Aide</Text>
                    <View style={styles.menuCard}>
                        <MenuItem icon={Globe} title="Langue" subtitle="Français" />
                        <MenuItem icon={FileText} title="Centre d'aide" />
                        <MenuItem icon={ShieldCheck} title="Confidentialité" />
                        <MenuItem icon={Info} title="À propos d'Akevas" />
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
    metricCard: {
        width: (width - 60) / 2,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
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
    quickLinkCard: {
        width: width * 0.38,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    quickLinkIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
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
        fontSize: 15,
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
