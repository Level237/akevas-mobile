import { Image } from 'expo-image';
import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Modal, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const MAIN_IMAGE_SIZE = width;
const THUMB_SIZE = 60;
const THUMB_SPACING = 10;

type Props = {
    images: { path: string }[];
};

const ImageGallery = ({ images }: Props) => {
    const insets = useSafeAreaInsets();
    const [activeIndex, setActiveIndex] = useState(0);
    const [viewerVisible, setViewerVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const viewerListRef = useRef<FlatList>(null);
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

    const toggleViewer = (visible: boolean) => {
        setViewerVisible(visible);
        // Sync viewer with current index when opening
        if (visible) {
            setTimeout(() => {
                viewerListRef.current?.scrollToIndex({ index: activeIndex, animated: false });
            }, 50);
        }
    };

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
                    renderItem={({ item, index }: { item: { path: string }, index: number }) => (
                        <TouchableOpacity
                            style={styles.mainImageContainer}
                            activeOpacity={0.9}
                            onPress={() => toggleViewer(true)}
                        >
                            <Image
                                source={{ uri: item.path }}
                                style={styles.mainImage}
                                contentFit="cover"
                                transition={300}
                                priority="high"
                            />
                        </TouchableOpacity>
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

            {/* Full-Screen Image Viewer (Facebook Style) */}
            <Modal
                visible={viewerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => toggleViewer(false)}
            >
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <View style={styles.viewerContainer}>
                    {/* Viewer Header */}
                    <View style={[styles.viewerHeader, { paddingTop: insets.top + 10 }]}>
                        <TouchableOpacity
                            onPress={() => toggleViewer(false)}
                            style={styles.viewerIconBtn}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft color="#FFF" size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.viewerIconBtn} activeOpacity={0.7}>
                            <MoreHorizontal color="#FFF" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Full-Screen Scrollable List */}
                    <FlatList
                        ref={viewerListRef}
                        data={images}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={activeIndex}
                        onScrollToIndexFailed={() => { }} // Handle quickly opening
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        scrollEventThrottle={16}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        renderItem={({ item }) => (
                            <View style={styles.viewerImageWrapper}>
                                <Image
                                    source={{ uri: item.path }}
                                    style={styles.viewerImage}
                                    contentFit="contain"
                                    transition={200}
                                />
                            </View>
                        )}
                    />
                </View>
            </Modal>
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
    // Viewer Styles
    viewerContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    viewerHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 100,
    },
    viewerIconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerImageWrapper: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerImage: {
        width: '100%',
        height: '80%', // Focus on center like Facebook
    },
});

export default React.memo(ImageGallery);
