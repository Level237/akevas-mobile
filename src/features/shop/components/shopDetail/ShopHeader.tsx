import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShopSearchModal from '../ShopSearch/ShopSearchModal';

const { width } = Dimensions.get('window');

export const MAX_HEADER_HEIGHT = 400;
export const MIN_HEADER_HEIGHT = 120;

type Props = {
    scrollY: SharedValue<number>;
};

const ShopHeader = ({ scrollY }: Props) => {
    const insets = useSafeAreaInsets();
    const SCROLL_DISTANCE = 200;
    const [searchVisible, setSearchVisible] = React.useState(false);

    const animatedContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE],
            [1, 0],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    return (
        <Animated.View style={[styles.container]}>
            {/* Background Image with Overlay */}
            <Animated.View style={[StyleSheet.absoluteFill]}>
                <Image
                    source={require('@/assets/images/shop1.webp')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Central Content */}
            <View style={styles.centerContainer}>
                <Animated.View style={[styles.titlesContainer, animatedContentStyle]}>
                    <Text style={styles.title}>Explorez vos Boutiques locales</Text>
                    <Text style={styles.description}>Découvrez nos meilleures boutiques qui correspondent à votre style</Text>
                </Animated.View>

                {/* Clickable Search Bar Trigger */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setSearchVisible(true)}
                    style={styles.searchBarContainer}
                >
                    <View style={styles.searchBar}>
                        <Search color="rgba(255,255,255,0.6)" size={20} />
                        <View style={styles.searchInputContainer}>
                            <Text style={styles.placeholderText}>
                                Rechercher une boutique...
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <ShopSearchModal
                visible={searchVisible}
                onClose={() => setSearchVisible(false)}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#6b0f1a', // Ensure solid background if image fails
        overflow: 'hidden',
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
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchInputContainer: {
        flex: 1,
        marginLeft: 10,
        height: '100%',
        justifyContent: 'center',
    },
    placeholderText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 15,
    },
});

export default ShopHeader;