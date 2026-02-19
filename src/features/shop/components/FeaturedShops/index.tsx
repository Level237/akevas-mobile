import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import CarouselHeader from './CarouselHeader';
import PaginationDots from './PaginationDots';
import ShopCard from './ShopCard';
import { SNAP_INTERVAL, styles } from './styles';

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

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.y === 0 ? event.contentOffset.x : scrollX.value;
        },
    });

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
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <ShopCard
                        name={item.name}
                        image={item.image}
                        isPremium={item.isPremium}
                    />
                )}
            />

            <View style={styles.footer}>
                <PaginationDots data={shops} scrollX={scrollX} />

                <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>Voir toutes les boutiques</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FeaturedShops;
