import HeaderTabs from '@/components/common/HeaderTabs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shop, ShopCardCompact } from '../../components/ShopCardList';
import ShopHeader from '../../components/shopDetail/ShopHeader';


import { useGetAllShopsQuery } from '@/services/guardService';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Text } from "react-native";

export default function ShopScreen() {
    const scrollY = useSharedValue(0);
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [page, setPage] = useState(1);

    const [allShops, setAllShops] = useState<Shop[]>([]);
    const [isFooterLoading, setIsFooterLoading] = useState(false);
    const { data, isLoading: isFetching, isError } = useGetAllShopsQuery(page.toString());
    console.log(page)
    useEffect(() => {
        if (data?.shopList) {
            if (page === 1) {
                setAllShops(data.shopList);
            } else {
                const existingIds = new Set(allShops.map(shop => shop.shop_id));

                const newUniqueShops = data.shopList.filter(shop => !existingIds.has(shop.shop_id));

                setAllShops((prevShops) => [...prevShops, ...newUniqueShops]);

                setTimeout(() => {
                    setIsFooterLoading(false);
                }, 400);
            }
        }
    }, [data, page]);

    const handleLoadMore = () => {

        if (isFetching || isFooterLoading) return;
        if (data && data.totalPagesResponse && page >= data.totalPagesResponse) return;

        setIsFooterLoading(true);

        setTimeout(() => {
            setPage((prev) => prev + 1);
        }, 600);

    };

    const renderListFooter = () => {
        if (!isFooterLoading) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#E67E22" />
                <Text style={styles.footerText}>Chargement...</Text>
            </View>
        );
    };


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
                    params: { id: shop?.shop_id || '' }
                });
            }}
        />
    ), [router]);

    if (isFetching && page === 1 && allShops.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#E67E22" />
            </View>
        );
    }

    if (isError) {
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
                data={allShops || []}
                keyExtractor={(item: any) => item.shop_id}
                onScroll={scrollHandler}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 10
                }}
                scrollEventThrottle={16}
                ListHeaderComponent={() => <ShopHeader scrollY={scrollY} />}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderListFooter}
                maxToRenderPerBatch={10} // Le nombre d'items rendus par cycle (optimisation RN)
                windowSize={10} // 
                contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8', // Matches Akevas Style Guide (Light Grey Background)
    },
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20, // Epace généreux pour ne pas que ça soit tassé
        gap: 10,
    },
    footerText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
        fontWeight: '500',
    },
});