import { COLORS } from '@/constants/colors';
import { subscribe } from '@/hooks/refreshManager';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RefreshOverlay = () => {
    const insets = useSafeAreaInsets();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const progressAnim = useRef(new Animated.Value(0)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const loopRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
    const unsub = subscribe((v) => setIsRefreshing(v));
    return () => {
        if (typeof unsub === 'function') {
            unsub();
        }
    };
}, []);

    useEffect(() => {
        if (isRefreshing) {
            loopRef.current = Animated.loop(
                Animated.timing(progressAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                })
            );
            loopRef.current.start();

            Animated.timing(overlayAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            if (loopRef.current) {
                loopRef.current.stop();
            }
            progressAnim.setValue(0);
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isRefreshing]);

    if (!isRefreshing) return null;

    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Animated.View
                style={[
                    styles.progressBarContainer,
                    { top: insets.top, zIndex: 9999 },
                ]}
            >
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                        },
                    ]}
                />
            </Animated.View>

            <Animated.View
                pointerEvents="none"
                style={[
                    styles.overlay,
                    {
                        opacity: overlayAnim,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarContainer: {
        height: 3,
        width: '100%',
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.53)',
        zIndex: 150000,
    },
});

export default RefreshOverlay;
