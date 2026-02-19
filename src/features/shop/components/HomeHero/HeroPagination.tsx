import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

type Props = {
    activeIndex: number;
    onPressDot: (index: number) => void
};

const HeroPagination = ({ activeIndex, onPressDot }: Props) => {


    return (
        <View style={styles.container}>
            {[0, 1, 2].map((i) => {
                const animatedStyle = useAnimatedStyle(() => {
                    return {
                        width: withSpring(activeIndex === i ? 28 : 10),
                        backgroundColor: activeIndex === i ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                    };
                });

                return (
                    <Pressable
                        key={i}
                        onPress={() => onPressDot(i)} // On appelle la fonction du parent
                        style={{ padding: 5 }} // Zone de clic agrandie (UX !)
                    >
                        <Animated.View style={[styles.dot, animatedStyle]} />
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
    },
});

export default HeroPagination;
