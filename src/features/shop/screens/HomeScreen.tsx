import { COLORS } from "@/constants/colors";
import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GenderHeader from "../components/GenderPanel";
import HomeHeader from "../components/HomeHeader";
import HomeHero from "../components/HomeHero";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

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

    // Dummy data for scroll testing
    const dummyData = Array.from({ length: 50 }).map((_, i) => ({ id: i.toString(), title: `Produit ${i + 1}` }));

    return (
        <View style={styles.container}>
            {/* Fixed Top Header (Safe Area handled inside) */}
            <HomeHeader />

            {/* Animated Secondary Header (Gender) */}
            <GenderHeader animatedStyle={animatedHeaderStyle} />

            {/* Scrollable Content */}
            <Animated.FlatList
                data={dummyData}
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