import { COLORS } from "@/constants/colors";
import { useGetHomeShopsQuery } from "@/services/guardService";
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeHeader from "../../../components/common/HomeHeader";
import FeaturedShops from "../components/FeaturedShops";
import GenderHeader from "../components/GenderPanel";
import HomeHero from "../components/HomeHero";

const dummyShops = [
    { id: 1, name: 'chia-2y30as', image: require('@/assets/images/shop1.webp'), isPremium: true },
    { id: 2, name: 'lari-i0b9c', image: require('@/assets/images/shop2.webp'), isPremium: true },
    { id: 3, name: 'Shop 3', image: require('@/assets/images/shop3.webp'), isPremium: false },
    { id: 4, name: 'Shop 4', image: require('@/assets/images/shop4.webp'), isPremium: true },
];

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { data: { data: shopsData } = {}, isLoading: shopsLoading, error: shopsError } = useGetHomeShopsQuery("guard", {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: 30
    })
    // Shared value for scroll position
    const scrollY = useSharedValue(0);
    const lastScrollY = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const currentY = event.contentOffset.y;
            const diff = currentY - lastScrollY.value;

            // Logic: Hide on scroll down, show on scroll up
            // translateY range: -50 (hidden) to 0 (visible)
            if (currentY <= 0) {
                translateY.value = withTiming(0);
            } else if (diff > 5) {
                // Scrolling down - hide
                translateY.value = Math.max(-110, translateY.value - diff); // Height of both headers eventually? Just stick to GenderHeader for now
            } else if (diff < -5) {
                // Scrolling up - show
                translateY.value = Math.min(0, translateY.value - diff);
            }

            lastScrollY.value = currentY;
            scrollY.value = currentY;
        },
    });

    const animatedHeaderStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            opacity: interpolate(
                translateY.value,
                [-50, 0],
                [0, 1],
                Extrapolation.CLAMP
            ),
        };
    });



    return (
        <View style={styles.container}>
            {/* Fixed Top Header (Safe Area handled inside) */}
            <HomeHeader />
            <StatusBar barStyle="dark-content" />
            {/* Animated Secondary Header (Gender) */}
            <GenderHeader animatedStyle={animatedHeaderStyle} />

            {/* Scrollable Content */}
            <Animated.FlatList
                data={shopsData}
                keyExtractor={(item) => item.id}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingBottom: insets.bottom + 20,
                        paddingTop: 60, // Start below GenderHeader
                    }
                ]}
                ListHeaderComponent={() => (
                    <View style={styles.heroWrapper}>
                        <HomeHero />
                        <FeaturedShops shops={shopsData} />
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={[styles.itemText, { color: '#333' }]}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: 0,
    },
    heroWrapper: {
        marginTop: 50, // Flush with GenderPanel (which has height: 50)
    },
    item: {
        height: 100,
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#edf2f7',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
});