import { COLORS } from "@/constants/colors";
import React from 'react';
import { StyleSheet, View } from "react-native";
import {
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

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    const scrollY = useSharedValue(0);
    const lastScrollY = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const currentY = event.contentOffset.y;
            const diff = currentY - lastScrollY.value;

            if (currentY <= 0) {
                translateY.value = withTiming(0);
            } else if (diff > 5) {
                translateY.value = Math.max(-50, translateY.value - diff);
            } else if (diff < -5) {
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

    const dummyData = Array.from({ length: 50 }).map((_, i) => ({ id: i.toString(), title: `Produit ${i + 1}` }));

    return (
        <View style={styles.container}>
            <HomeHeader />

            <GenderHeader animatedStyle={animatedHeaderStyle} />



        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    item: {
        height: 100,
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e1e1',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
});