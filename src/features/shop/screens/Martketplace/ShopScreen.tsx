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


import { useGetHomeShopsQuery } from '@/services/guardService';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Text } from "react-native";

export default function ShopScreen() {
    const scrollY = useSharedValue(0);
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const { data: { data: shopsData } = {}, isLoading: shopsLoading, error: shopsError } = useGetHomeShopsQuery("guard", {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: 30
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const renderItem = useCallback(({ item, index }: { item: Shop; index: number }) => (
        <ShopCardCompact
            shop={item}
            isPriority={index < 5}
            onPress={(shop) => {
                router.push({
                    pathname: "/[id]",
                    params: { id: shop.shop_id }
                });
            }}
        />
    ), [router]);

    if (shopsLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#E67E22" />
            </View>
        );
    }

    if (shopsError) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Erreur de chargement des boutiques.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Main Content List */}
            <HeaderTabs title='Boutiques' />
            <Animated.FlatList
                data={shopsData || []}
                keyExtractor={(item) => item.shop_id}
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