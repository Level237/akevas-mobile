import HeaderTabs from '@/components/common/HeaderTabs';
import React from 'react';
import { StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shop, ShopCardCompact } from '../../components/ShopCardList';
import ShopHeader from '../../components/shopDetail/ShopHeader';

const dummyData: Shop[] = Array.from({ length: 40 }).map((_, i) => ({
    id: i.toString(),
    name: `Akevas Boutique ${i + 1}`,
    description: "Une description élégante pour une boutique de mode locale premium.",
    rating: 4.5 + (i % 5) * 0.1,
    reviewsCount: 120 + i * 2,
    city: i % 2 === 0 ? "Douala" : "Yaoundé",
    isPremium: i % 3 === 0,
    tags: ["Mode", "Artisanat", "Luxe"],
    imageUrl: require('@/assets/images/shop1.webp'),
    bannerUrl: require('@/assets/images/shop1.webp'),
    logoUrl: require('@/assets/images/logo.png'),
}));

export default function ShopScreen() {
    const scrollY = useSharedValue(0);
    const insets = useSafeAreaInsets();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const renderItem = ({ item, index }: { item: Shop; index: number }) => (
        <ShopCardCompact
            shop={item}
            isPriority={index < 5}
            onPress={(shop) => console.log('Shop pressed:', shop.name)}
        />
    );

    return (
        <View style={styles.container}>
            {/* Main Content List */}
            <HeaderTabs title='Boutiques' />
            <Animated.FlatList
                data={dummyData}
                keyExtractor={(item) => item.id.toString()}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                ListHeaderComponent={() => <ShopHeader scrollY={scrollY} />}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8', // Matches Akevas Style Guide (Light Grey Background)
    },
});