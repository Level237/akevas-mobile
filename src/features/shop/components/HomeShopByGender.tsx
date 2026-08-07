import { COLORS } from '@/constants/colors';
import { useGetHomeShopsByGenderQuery } from '@/services/guardService';
import { Shop } from '@/types/seller';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import PaginationDots from './FeaturedShops/PaginationDots';
import ShopCard from './FeaturedShops/ShopCard';

type Props = {
    refetchControl: any;
};

const GENDERS = [
    { id: 1, label: 'Boutiques Homme', subtitle: "L'élégance pour homme" },
    { id: 2, label: 'Boutiques Femme', subtitle: "L'élégance pour femme" },
    { id: 3, label: 'Boutiques Enfant', subtitle: "L'élégance pour enfant" },
];

const { width } = Dimensions.get('window');
const SCREEN_PADDING = 20;
const CARD_WIDTH = (width - SCREEN_PADDING * 3) / 2;
const SNAP_INTERVAL = CARD_WIDTH + SCREEN_PADDING;

// ✅ Constantes sorties du composant — stables, ne recalculent pas à chaque rendu

const HomeShopByGender = ({ refetchControl }: Props) => {
    const [gender] = useState(
        () => GENDERS[Math.floor(Math.random() * GENDERS.length)]
    );

    const { data: { data: shops } = {}, isLoading } = useGetHomeShopsByGenderQuery(
        gender.id,
        { refetchOnMountOrArgChange: 30 }
    );

    const scrollX = useSharedValue(0);
    const [activeIndex, setActiveIndex] = useState(0);

    // ✅ Fix principal : un seul handler qui gère scrollX ET activeIndex
    // runOnJS permet d'appeler setActiveIndex (JS thread) depuis un worklet (UI thread)
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const x = event.contentOffset.x;
            scrollX.value = x;

            // Calcul de l'index actif depuis le worklet via runOnJS
            const index = Math.round(x / (SNAP_INTERVAL * 2));
            runOnJS(setActiveIndex)(index);
        },
    });

    const renderItem = React.useCallback(
        ({ item }: { item: Shop }) => (
            <View style={{ width: CARD_WIDTH, marginRight: SCREEN_PADDING }}>
                <ShopCard
                    id={item.shop_id || ''}
                    key={item.shop_id || ''}
                    name={item.shop_key || ''}
                    image={item.shop_profile || ''}
                />
            </View>
        ),
        []
        // ✅ CARD_WIDTH et SCREEN_PADDING sont maintenant des constantes externes
        // donc pas besoin de les mettre dans les deps
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{gender.label}</Text>
                <Text style={styles.subtitle}>{gender.subtitle}</Text>
            </View>

            <Animated.FlatList
                data={shops || []}
                refreshControl={refetchControl}
                keyExtractor={(item) => item.shop_id || ''}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                snapToAlignment="start"
                onScroll={scrollHandler}
                // ✅ Plus de onScroll natif — scrollHandler gère tout
                scrollEventThrottle={16}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING }}
                renderItem={renderItem}
                ListEmptyComponent={
                    isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Chargement des boutiques...
                            </Text>
                        </View>
                    ) : null
                }
            />

            <View style={styles.footer}>
                {/* ✅ scrollX est passé comme shared value, jamais scrollX.value */}
                <PaginationDots
                    data={shops || []}
                    scrollX={scrollX}
                    snapInterval={SNAP_INTERVAL}
                />

                <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>Voir toutes les boutiques</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default React.memo(HomeShopByGender);

const styles = StyleSheet.create({
    container: { paddingVertical: 24 },
    header: { paddingHorizontal: 20, marginBottom: 18 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
    subtitle: { fontSize: 13, color: '#6B7280' },
    footer: { marginTop: 20, alignItems: 'center', gap: 14 },
    viewAllButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
    },
    viewAllText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
        minWidth: 200,
    },
    emptyText: { fontSize: 14, color: '#9CA3AF' },
});