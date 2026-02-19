import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Extrapolation,
    SharedValue,
    interpolate,
    interpolateColor,
    useAnimatedStyle
} from 'react-native-reanimated';
import { SNAP_INTERVAL } from './styles';

type Props = {
    data: any[];
    scrollX: SharedValue<number>;
};

const PaginationDots = ({ data, scrollX }: Props) => {
    return (
        <View style={styles.container}>
            {data.map((_, index) => {
                const animatedStyle = useAnimatedStyle(() => {
                    const width = interpolate(
                        scrollX.value,
                        [
                            (index - 1) * SNAP_INTERVAL,
                            index * SNAP_INTERVAL,
                            (index + 1) * SNAP_INTERVAL,
                        ],
                        [10, 20, 10],
                        Extrapolation.CLAMP
                    );

                    const backgroundColor = interpolateColor(
                        scrollX.value,
                        [
                            (index - 1) * SNAP_INTERVAL,
                            index * SNAP_INTERVAL,
                            (index + 1) * SNAP_INTERVAL,
                        ],
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

export default PaginationDots;
