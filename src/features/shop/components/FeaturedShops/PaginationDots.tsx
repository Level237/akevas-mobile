import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Extrapolation,
    SharedValue,
    interpolate,
    interpolateColor,
    useAnimatedStyle
} from 'react-native-reanimated';

type Props = {
    data: any[];
    scrollX: SharedValue<number>;
    snapInterval: number;
};

const PaginationDots = ({ data, scrollX, snapInterval }: Props) => {
    // Number of dots: if we show 2 cards per view, we want 1 dot per 2 cards
    const dotsCount = Math.ceil(data.length / 2);
    const dotIndices = Array.from({ length: dotsCount }).map((_, i) => i);

    return (
        <View style={styles.container}>
            {dotIndices.map((index) => {
                const animatedStyle = useAnimatedStyle(() => {
                    // Each dot represents a "page" of 2 cards
                    // Distance per page is snapInterval * 2
                    const inputRange = [
                        (index - 1) * (snapInterval * 2),
                        index * (snapInterval * 2),
                        (index + 1) * (snapInterval * 2),
                    ];

                    const width = interpolate(
                        scrollX.value,
                        inputRange,
                        [10, 20, 10],
                        Extrapolation.CLAMP
                    );

                    const backgroundColor = interpolateColor(
                        scrollX.value,
                        inputRange,
                        ['rgba(255,255,255,0.2)', '#007AFF', 'rgba(255,255,255,0.2)']
                    );

                    return {
                        width,
                        backgroundColor,
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[styles.dot, animatedStyle]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        height: 10,
        borderRadius: 5,
    },
});

export default React.memo(PaginationDots);
