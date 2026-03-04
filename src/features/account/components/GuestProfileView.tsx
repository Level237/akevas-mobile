import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, LogIn, ShieldCheck, ShoppingBag, TrendingUp, UserPlus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type GuestProfileViewProps = {
    onLogin?: () => void;
    onRegister?: () => void;
};

const VALUE_PROPS = [
    {
        id: 'boutiques',
        icon: ShoppingBag,
        title: 'Boutiques Uniques',
        description: 'Découvrez des créateurs et boutiques sélectionnées pour vous.',
        color: '#E67E22',
        bgColor: '#FFF7ED',
    },
    {
        id: 'favoris',
        icon: Heart,
        title: 'Vos Favoris',
        description: 'Sauvegardez vos articles et créez votre wishlist idéale.',
        color: '#EC4899',
        bgColor: '#FDF2F8',
    },
    {
        id: 'securite',
        icon: ShieldCheck,
        title: 'Achat Sécurisé',
        description: 'Paiement 100% protégé et suivi de commande en direct.',
        color: '#10B981',
        bgColor: '#ECFDF5',
    },
    {
        id: 'tendances',
        icon: TrendingUp,
        title: 'Tendances',
        description: "Restez à l'affût des dernières nouveautés mode.",
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
    },
];

const GuestProfileView = ({ onLogin, onRegister }: GuestProfileViewProps) => {
    const insets = useSafeAreaInsets();
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(30);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
                bounces={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Image
                        source="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000"
                        style={styles.heroImage}
                        contentFit="cover"
                        transition={500}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)', '#111827']}
                        style={styles.heroGradient}
                    />

                    <Animated.View
                        style={[
                            styles.heroContent,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>Marketplace Premium</Text>
                        </View>
                        <Text style={styles.title}>L'univers de vos boutiques préférées</Text>
                        <Text style={styles.subtitle}>
                            Rejoignez la communauté Akevas pour une expérience shopping personnalisée.
                        </Text>
                    </Animated.View>
                </View>

                {/* Value Props Horizontal List */}
                <View style={styles.valuePropsContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.valuePropsScroll}
                        snapToInterval={width * 0.7 + 16}
                        decelerationRate="fast"
                    >
                        {VALUE_PROPS.map((prop, index) => {
                            const Icon = prop.icon;
                            return (
                                <Animated.View
                                    key={prop.id}
                                    style={[
                                        styles.valueCard,
                                        {
                                            opacity: fadeAnim,
                                            transform: [{ translateY: slideAnim }],
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            { backgroundColor: prop.bgColor },
                                        ]}
                                    >
                                        <Icon size={24} color={prop.color} strokeWidth={2.5} />
                                    </View>
                                    <Text style={styles.cardTitle}>{prop.title}</Text>
                                    <Text style={styles.cardDesc}>{prop.description}</Text>
                                </Animated.View>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Additional Info Section if needed */}
                <Animated.View
                    style={[
                        styles.infoSection,
                        { opacity: fadeAnim }
                    ]}
                >
                    <Text style={styles.infoTitle}>Pourquoi créer un compte ?</Text>
                    <View style={styles.infoList}>
                        <View style={styles.infoRow}>
                            <View style={styles.dot} />
                            <Text style={styles.infoText}>Gérez vos commandes facilement</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.dot} />
                            <Text style={styles.infoText}>Profitez de promotions exclusives</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.dot} />
                            <Text style={styles.infoText}>Contactez les vendeurs directement</Text>
                        </View>
                    </View>
                </Animated.View>

            </ScrollView>

            {/* Bottom Actions fixed */}
            <View style={[styles.bottomActions, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', '#FFFFFF']}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                />
                <View style={styles.actionsContent}>
                    <TouchableOpacity
                        style={styles.registerButton}
                        activeOpacity={0.85}
                        onPress={onRegister}
                    >
                        <UserPlus size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.registerButtonText}>Créer mon compte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        activeOpacity={0.7}
                        onPress={onLogin}
                    >
                        <LogIn size={20} color="#111827" style={styles.buttonIcon} />
                        <Text style={styles.loginButtonText}>Se Connecter</Text>
                    </TouchableOpacity>
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
    scrollView: {
        flex: 1,
    },
    heroSection: {
        height: 480,
        position: 'relative',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 60,
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        zIndex: 10,
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 12,
        letterSpacing: -1,
        lineHeight: 42,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 24,
        fontWeight: '500',
        paddingRight: 20,
    },
    valuePropsContainer: {
        marginTop: -30,
        zIndex: 20,
    },
    valuePropsScroll: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    valueCard: {
        width: width * 0.7,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        fontWeight: '500',
    },
    infoSection: {
        paddingHorizontal: 24,
        marginTop: 20,
        marginBottom: 40,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 16,
    },
    infoList: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E67E22',
        marginRight: 12,
    },
    infoText: {
        fontSize: 15,
        color: '#4B5563',
        fontWeight: '500',
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 40,
        zIndex: 50,
    },
    actionsContent: {
        zIndex: 51,
        gap: 12,
    },
    registerButton: {
        backgroundColor: '#E67E22',
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#E67E22',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    registerButtonText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#FFF',
    },
    loginButton: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    loginButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    buttonIcon: {
        marginRight: 10,
    },
});

export default React.memo(GuestProfileView);

