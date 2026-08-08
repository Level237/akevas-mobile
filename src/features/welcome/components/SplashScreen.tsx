import { COLORS } from '@/constants/colors';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
    const anims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    useEffect(() => {
        const animations = anims.map((anim) =>
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 620,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.delay(120),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 620,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.delay(120),
            ])
        );

        Animated.loop(Animated.stagger(140, animations)).start();
    }, [anims]);

    return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.squaresContainer}>
                    {anims.map((anim, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.square,
                                {
                                    opacity: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.25, 1],
                                    }),
                                    transform: [
                                        {
                                            scale: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.85, 1.25],
                                            }),
                                        },
                                        {
                                            translateY: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -4],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with Akevas</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 75,
        height: 75,
        marginBottom: 20,
    },
    squaresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
    },
    square: {
        width: 9,
        height: 9,
        backgroundColor: COLORS.primary,
        borderRadius: 7, // Cercle doux
        marginHorizontal: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
    },
    footerText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default SplashScreen;
