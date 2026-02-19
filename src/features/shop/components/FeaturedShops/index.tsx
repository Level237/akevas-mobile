import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import CarouselHeader from './CarouselHeader';
import PaginationDots from './PaginationDots';
import ShopCard from './ShopCard';
import { styles } from './styles';

type Shop = {
    id: string | number;
    name: string;
    image: any;
    isPremium?: boolean;
};

type Props = {
    shops: Shop[];
};

const FeaturedShops = ({ shops }: Props) => {
    const scrollX = useSharedValue(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const SCREEN_PADDING = 20;
    const { width } = Dimensions.get('window');
    const CARD_WIDTH = (width - (SCREEN_PADDING * 3)) / 2;
    const SNAP_INTERVAL = CARD_WIDTH + SCREEN_PADDING;
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.y === 0 ? event.contentOffset.x : scrollX.value;
        },
    });

    const onScroll = (event: any) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        // On divise la position actuelle par la largeur totale d'un groupe (2 cartes + marges)
        const index = Math.round(scrollOffset / (SNAP_INTERVAL * 2));
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <CarouselHeader />

            <Animated.FlatList
                data={shops}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                snapToAlignment="start"
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingHorizontal: SCREEN_PADDING,
                }}
                renderItem={({ item }) => (
                    <View style={{ width: CARD_WIDTH, marginRight: SCREEN_PADDING }}>
                        <ShopCard

                            name={item.name}
                            image={item.image}
                            isPremium={item.isPremium}
                        />
                    </View>
                )}
            />

            <View style={styles.footer}>
                <PaginationDots data={shops} scrollX={scrollX} snapInterval={SNAP_INTERVAL} />

                <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>Voir toutes les boutiques</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FeaturedShops;
