import { useGetHomeShopsQuery } from '@/services/guardService';
import { Image } from 'expo-image';
import { Search as SearchIcon, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shop } from '../ShopCardList';
import RenderSuggestedShops from './ShopSuggested';

import { useRouter } from 'expo-router';

type Props = {
    visible: boolean;
    onClose: () => void;
};

// Redesigned Search Result Item (Mockup style)
const SearchResultItem = React.memo(({ shop }: { shop: Shop }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: "/[id]",
            params: { id: shop.shop_id || "" }
        });
    };

    return (
        <TouchableOpacity
            style={styles.resultCard}
            activeOpacity={0.8}
            onPress={handlePress}
        >
            <Image
                source={shop.shop_profile}
                style={styles.resultImage}
                contentFit="cover"
                transition={300}
            />
            <View style={styles.resultContent}>
                <Text style={styles.resultTitle} numberOfLines={1}>
                    {shop.shop_name}
                </Text>
                <Text style={styles.resultDescription} numberOfLines={2}>
                    {shop.shop_description || "Découvrez nos produits uniques et exclusifs."}
                </Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>
                        {shop.products_count || 0} produits
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const ShopSearchModal = ({ visible, onClose }: Props) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: homeShopsData, isLoading } = useGetHomeShopsQuery(undefined, {
        skip: !visible
    });

    const shops = useMemo(() => homeShopsData?.data || [], [homeShopsData]);

    const filteredShops = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return shops.filter((shop: Shop) =>
            shop.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.town?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, shops]);



    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <StatusBar barStyle="light-content" />
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X color="#FFF" size={24} />
                    </TouchableOpacity>

                    <View style={styles.searchBar}>
                        <SearchIcon color="rgba(255,255,255,0.5)" size={18} />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Rechercher une boutique..."
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            style={styles.searchInput}
                            autoFocus
                            selectionColor="#E67E22"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X color="rgba(255,255,255,0.5)" size={16} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Main Scrollable Content */}
                <FlatList
                    data={filteredShops}
                    keyExtractor={(item: any) => item.shop_id.toString()}
                    ListHeaderComponent={() => (
                        <>
                            {!searchQuery && <RenderSuggestedShops shops={shops || []} />}
                            {searchQuery.length > 0 && filteredShops.length > 0 && (
                                <Text style={styles.sectionTitleResults}>Résultats de recherche</Text>
                            )}
                        </>
                    )}
                    renderItem={({ item }) => <SearchResultItem shop={item} />}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingBottom: insets.bottom + 20 }
                    ]}
                    ListEmptyComponent={() => (
                        searchQuery.length > 0 && !isLoading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyTitle}>Aucun résultat</Text>
                                <Text style={styles.emptySubtitle}>
                                    Nous n'avons trouvé aucune boutique correspondant à "{searchQuery}"
                                </Text>
                            </View>
                        ) : null
                    )}
                />

                {isLoading && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator color="#E67E22" size="large" />
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Black background as per mockup
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    closeBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626', // Dark grey from mockup
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: '#FFF',
        fontSize: 16,
    },
    sectionTitleResults: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        opacity: 0.6,
        marginTop: 8,
    },
    // Search Results (Card Style)
    listContent: {
        paddingHorizontal: 16,
    },
    resultCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A', // Card background from mockup
        borderRadius: 20,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#262626',
    },
    resultImage: {
        width: 90,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#262626',
    },
    resultContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    resultTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    resultDescription: {
        color: '#8A8A8A',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 8,
    },
    countBadge: {
        backgroundColor: '#262626',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        color: '#E67E22',
        fontSize: 12,
        fontWeight: '600',
    },
    // States
    emptyContainer: {
        marginTop: 60,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySubtitle: {
        color: '#8A8A8A',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    loaderContainer: {
        position: 'absolute',
        top: 200,
        left: 0,
        right: 0,
        alignItems: 'center',
    }
});

export default React.memo(ShopSearchModal);
