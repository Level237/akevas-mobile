import { COLORS } from '@/constants/colors';
import { Shop } from '@/types/seller';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;

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
    const [replyText, setReplyText] = useState('');

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
            if (finished && !isPaused) {
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
        const currentProgress = (progress as any)._value;
        const remainingTime = STORY_DURATION * (1 - currentProgress);

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
            animationType="slide"
            onRequestClose={onClose}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                {/* Background Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={storyImages[currentIndex]}
                        style={styles.image}
                        contentFit="cover"
                        transition={400}
                    />
                </View>

                {/* Top Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                    style={[styles.topGradient, { height: insets.top + 100 }]}
                />

                {/* Interactive Tapping Areas */}
                <Pressable
                    onPress={handleTap}
                    onLongPress={handlePressIn}
                    onPressOut={handlePressOut}
                    style={StyleSheet.absoluteFill}
                />

                {/* UI Overlay Content */}
                <View style={[styles.mainOverlay, { paddingTop: insets.top + 10 }]}>
                    {/* Progress Bars */}
                    <View style={styles.progressContainer}>
                        {storyImages.map((_, index) => (
                            <View key={index} style={styles.progressBarBackground}>
                                <Animated.View
                                    style={[
                                        styles.progressBarForeground,
                                        {
                                            width: index === currentIndex
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

                    {/* Header: Shop Info */}
                    <View style={styles.header}>
                        <View style={styles.shopSection}>
                            <View style={styles.avatarBorder}>
                                <Image
                                    source={shop.shop_profile}
                                    style={styles.miniAvatar}
                                />
                            </View>
                            <View style={styles.shopText}>
                                <Text style={styles.shopName} numberOfLines={1}>{shop.shop_name}</Text>
                                <Text style={styles.shopTime}>En direct • {shop.town || 'Akevas'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <X color="#FFF" size={28} strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* View Shop Link */}
                    <TouchableOpacity
                        style={styles.viewShopBtn}
                        onPress={() => {
                            onClose();
                            onViewShop(shop.shop_id || '');
                        }}
                    >
                        <View style={styles.viewShopContent}>
                            <Text style={styles.viewShopText}>Voir la boutique</Text>
                            <ChevronRight color="white" size={18} />
                        </View>
                    </TouchableOpacity>


                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: width,
        height: height,
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    mainOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        gap: 4,
        height: 2.5,
        marginTop: 5,
    },
    progressBarBackground: {
        flex: 1,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 10,
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
    shopSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarBorder: {
        padding: 2,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#E67E22',
        backgroundColor: 'transparent',
    },
    miniAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    shopText: {
        gap: 1,
    },
    shopName: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
        maxWidth: width * 0.5,
    },
    shopTime: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '500',
    },
    closeBtn: {
        padding: 4,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    viewShopBtn: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    viewShopContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    viewShopText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    interactionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    replyContainer: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    replyInput: {
        color: '#FFF',
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionIcon: {
        padding: 2,
    },
});

export default React.memo(ShopStoryViewer);
