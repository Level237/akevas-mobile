import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type Props = {
    images: string[];
};

const ImageCarousel = ({ images }: Props) => {
    const scrollX = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    if (!images || images.length === 0) return null;

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {images.map((img, index) => (
                    <Image
                        key={index}
                        source={{ uri: img }}
                        style={styles.image}
                        contentFit="cover"
                        transition={300}
                    />
                ))}
            </Animated.ScrollView>

            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <PaginationDot key={index} index={index} scrollX={scrollX} />
                ))}
            </View>
        </View>
    );
};

const PaginationDot = ({ index, scrollX }: { index: number; scrollX: Animated.SharedValue<number> }) => {
    // Basic dot implementation for now
    return (
        <View style={styles.dot} />
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 450,
        backgroundColor: '#F9F9F9',
    },
    image: {
        width: width,
        height: 450,
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
});

export default React.memo(ImageCarousel);
