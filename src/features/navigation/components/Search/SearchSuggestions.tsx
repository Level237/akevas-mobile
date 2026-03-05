import ProductCard from '@/components/ProductCard';
import ShopCardCompact from '@/features/shop/components/ShopCardList/ShopCardCompact';
import { normalizeProduct } from '@/lib/normalizeProduct';
import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchSuggestion } from './types';

type Props = {
    suggestions: SearchSuggestion | null;
    onSelect: (text: string) => void;
};

const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const SearchSuggestions = ({ suggestions, onSelect }: Props) => {
    if (!suggestions) return null;

    const hasShops = suggestions.shops && suggestions.shops.length > 0;
    const hasProducts = suggestions.products && suggestions.products.length > 0;

    if (!hasShops && !hasProducts) return null;

    const normalizedProducts = suggestions.products.map(normalizeProduct);
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {hasShops && (
                <View style={styles.section}>
                    <SectionHeader title="Boutiques" />
                    <View style={styles.shopsContainer}>
                        {suggestions.shops.map((shop) => (
                            <ShopCardCompact
                                key={shop.shop_id}
                                shop={shop}
                                isPriority={true}
                            />
                        ))}
                    </View>
                </View>
            )}

            {hasProducts && (
                <View style={styles.section}>
                    <SectionHeader title="Produits" />
                    <View style={styles.productsGrid}>
                        {normalizedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        marginTop: 10,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    shopsContainer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingTop: 10,
    },
});

export default memo(SearchSuggestions);
