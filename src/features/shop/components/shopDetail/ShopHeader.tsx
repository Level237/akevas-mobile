import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const MAX_HEADER_HEIGHT = 400;
export const MIN_HEADER_HEIGHT = 120;




import { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
    scrollY: SharedValue<number>;
};

const ShopHeader = ({ scrollY }: Props) => {
    const insets = useSafeAreaInsets();
    const SCROLL_DISTANCE = 200;

    const animatedContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    const animatedSearchStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE],
            [0, -100],
            Extrapolation.CLAMP
        );
        return { transform: [{ translateY }] };
    });











    return (
        <Animated.View style={[styles.container]}>
            {/* Image de fond avec overlay */}
            <Animated.View style={[StyleSheet.absoluteFill]}>
                <Image
                    source={require('@/assets/images/shop1.webp')} // Placeholder for cloth blur
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Fond bordeaux uni (Sticky mode) */}


            {/* Top Bar: Burger, Logo, Search, User, Cart */}


            {/* Contenu central */}
            <View style={styles.centerContainer}>
                <Animated.View style={[styles.titlesContainer, animatedContentStyle]}>
                    <Text style={styles.title}>Explorez vos Boutiques locales</Text>
                    <Text style={styles.description}>Découvrez nos meilleures boutiques  qui correspondent à votre style</Text>
                </Animated.View>

                {/* Barre de recherche */}
                <Animated.View style={[styles.searchBarContainer, animatedSearchStyle]}>
                    <View style={styles.searchBar}>
                        <Search color="rgba(255,255,255,0.6)" size={20} />
                        <TextInput
                            placeholder="Rechercher une boutique..."
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            style={styles.searchInput}
                        />
                    </View>
                </Animated.View>

                {/* Stats */}

            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#6b0f1a', // Ensure solid background if image fails
        overflow: 'hidden',

    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
        tintColor: '#FFF', // Make logo white for dark header integration if possible
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconButton: {
        padding: 4,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
        height: 300
    },
    titlesContainer: {
        alignItems: 'center',
        marginBottom: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    searchBarContainer: {
        width: '100%',
        zIndex: 2000,
        marginTop: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 25,
        paddingHorizontal: 12,
        height: 45,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: '#FFF',

        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 30,
        gap: 20,
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 15,
        gap: 12,
        minWidth: 150,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
});

export default ShopHeader;