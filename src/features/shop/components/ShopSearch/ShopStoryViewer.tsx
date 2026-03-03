import { Shop } from '@/types/seller';
import { Image } from 'expo-image';
import { ChevronLeft, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds per story

type Props = {
    visible: boolean;
    shop: Shop | null;
    onClose: () => void;
    onViewShop: (shopId: string) => void;
};

const ShopStoryViewer = ({ visible, shop, onClose, onViewShop }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const progress = useRef(new Animated.Value(0)).current;
    const [isPaused, setIsPaused] = useState(false);

    const insets = useSafeAreaInsets();

    const storyImages = useMemo(() => {
        if (!shop) return [];
        const images = [shop.shop_profile];
        if (shop.images) {
            images.push(...shop.images.map(img => img.path));
        }
        return images.filter(Boolean) as string[];
    }, [shop]);

    useEffect(() => {
        if (visible) {
            startAnimation();
        } else {
            setCurrentIndex(0);
            progress.setValue(0);
        }
    }, [visible, currentIndex]);

    const startAnimation = () => {
        progress.setValue(0);
        Animated.timing(progress, {
            toValue: 1,
            duration: STORY_DURATION,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                nextStory();
            }
        });
    };

    const nextStory = () => {
        if (currentIndex < storyImages.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onClose();
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handlePressIn = () => {
        setIsPaused(true);
        progress.stopAnimation();
    };

    const handlePressOut = () => {
        setIsPaused(false);
        const remainingTime = STORY_DURATION * (1 - (progress as any)._value);
        Animated.timing(progress, {
            toValue: 1,
            duration: remainingTime,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                nextStory();
            }
        });
    };

    const handleTap = (evt: any) => {
        const x = evt.nativeEvent.locationX;
        if (x < width / 3) {
            prevStory();
        } else {
            nextStory();
        }
    };

    if (!shop || storyImages.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            onRequestClose={onClose}
        >
            <StatusBar hidden />
            <View style={styles.container}>
                {/* Story Image */}
                <Pressable
                    onPress={handleTap}
                    onLongPress={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.pressableArea}
                >
                    <Image
                        source={storyImages[currentIndex]}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                    />
                </Pressable>

                {/* Progress Indicators */}
                <View style={[styles.overlay, { paddingTop: insets.top }]}>
                    <View style={styles.progressContainer}>
                        {storyImages.map((_, index) => (
                            <View key={index} style={styles.progressBarBackground}>
                                <Animated.View
                                    style={[
                                        styles.progressBarForeground,
                                        {
                                            width:
                                                index === currentIndex
                                                    ? progress.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0%', '100%'],
                                                    })
                                                    : index < currentIndex
                                                        ? '100%'
                                                        : '0%',
                                        },
                                    ]}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Header Info */}
                    <View style={styles.header}>
                        <View style={styles.shopInfo}>
                            <Image
                                source={shop.shop_profile}
                                style={styles.miniAvatar}
                            />
                            <View>
                                <Text style={styles.shopName}>{shop.shop_name}</Text>
                                <Text style={styles.shopLocation}>{shop.town || 'Akevas Market'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X color="#FFF" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer CTA */}
                <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => {
                            onClose();
                            onViewShop(shop.shop_id || '');
                        }}
                    >
                        <Text style={styles.ctaText}>Voir la boutique</Text>
                        <ChevronLeft
                            color="#FFF"
                            size={20}
                            style={{ transform: [{ rotate: '180deg' }] }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    pressableArea: {
        flex: 1,
    },
    image: {
        width: width,
        height: height,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 5,
        height: 3,
        marginTop: 10,
    },
    progressBarBackground: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarForeground: {
        height: '100%',
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 15,
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    miniAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    shopName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    shopLocation: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    closeBtn: {
        padding: 5,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(230, 126, 34, 0.9)', // Akevas Orange with opacity
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    ctaText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default React.memo(ShopStoryViewer);
