import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const MAIN_IMAGE_SIZE = width;
const THUMB_SIZE = 60;
const THUMB_SPACING = 10;

type Props = {
    images: { path: string }[];
};

const ImageGallery = ({ images }: Props) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const scrollToImage = useCallback((index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setActiveIndex(index);
    }, []);

    if (!images || images.length === 0) return null;

    return (
        <View style={styles.container}>
            {/* Main Image Carousel */}
            <View style={styles.mainWrapper}>
                <Animated.FlatList
                    ref={flatListRef}
                    data={images}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    scrollEventThrottle={16}
                    renderItem={({ item }: { item: { path: string } }) => (
                        <View style={styles.mainImageContainer}>
                            <Image
                                source={{ uri: item.path }}
                                style={styles.mainImage}
                                contentFit="cover"
                                transition={300}
                            />
                        </View>
                    )}
                />
            </View>

            {/* Thumbnails */}
            <View style={styles.thumbnailContainer}>
                <FlatList
                    data={images}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailList}
                    renderItem={({ item, index }: { item: { path: string }, index: number }) => (
                        <TouchableOpacity
                            onPress={() => scrollToImage(index)}
                            activeOpacity={0.8}
                            style={[
                                styles.thumbWrapper,
                                activeIndex === index && styles.activeThumbWrapper
                            ]}
                        >
                            <Image
                                source={{ uri: item.path }}
                                style={styles.thumbImage}
                                contentFit="cover"
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: '#FFF',
    },
    mainWrapper: {
        width: width,
        height: MAIN_IMAGE_SIZE,
        backgroundColor: '#F9F9F9',
        overflow: 'hidden',
    },
    mainImageContainer: {
        width: width,
        height: MAIN_IMAGE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    thumbnailContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    thumbnailList: {
        gap: THUMB_SPACING,
    },
    thumbWrapper: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '#FFF',
    },
    activeThumbWrapper: {
        borderColor: '#E67E22', // Akevas orange
    },
    thumbImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});

export default React.memo(ImageGallery);
