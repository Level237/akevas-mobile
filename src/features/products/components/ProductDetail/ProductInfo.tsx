import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    name: string;
    price: string;
    originalPrice?: string;
    rating: number | null;
    reviewCount: number | null;
    shopName: string;
    quantity: number;
    wholesaleTiers?: any[];
    activeWholesale?: any;
    isWholesaleOnly?: boolean;
};

const ProductInfo = ({
    name,
    price,
    originalPrice,
    rating,
    reviewCount,
    shopName,
    quantity,
    wholesaleTiers = [],
    activeWholesale,
    isWholesaleOnly = false
}: Props) => {
    const hasWholesale = wholesaleTiers.length > 0;
    const discountPercent = originalPrice && Number(price) < Number(originalPrice)
        ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.shopSection}>
                    <Text style={styles.shopName}>{shopName}</Text>
                    {isWholesaleOnly ? (
                        <View style={[styles.modeBadge, { backgroundColor: '#FEE2E2' }]}>
                            <Text style={[styles.modeText, { color: '#B91C1C' }]}>GROS UNIQUEMENT</Text>
                        </View>
                    ) : (
                        hasWholesale && (
                            <View style={[styles.modeBadge, { backgroundColor: '#E0E7FF' }]}>
                                <Text style={[styles.modeText, { color: '#4338CA' }]}>MIXTE (GROS + DÉTAIL)</Text>
                            </View>
                        )
                    )}
                </View>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#E67E22" />
                    <Text style={styles.ratingText}>
                        {rating || '0.0'} ({reviewCount || 0})
                    </Text>
                </View>
            </View>

            <Text style={styles.name}>{name}</Text>

            <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{price} FCFA</Text>
                    {discountPercent && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>-{discountPercent}%</Text>
                        </View>
                    )}
                    <View style={styles.stockBadge}>
                        <Text style={styles.stockText}>{quantity} En stock</Text>
                    </View>
                </View>

                {originalPrice && Number(price) < Number(originalPrice) && (
                    <Text style={styles.originalPrice}>{originalPrice} FCFA</Text>
                )}
            </View>

            {/* Wholesale Tiers Section */}
            {hasWholesale && (
                <View style={styles.wholesaleSection}>
                    <View style={styles.wholesaleHeader}>
                        <Ionicons name="pricetags-outline" size={16} color="#4B5563" />
                        <Text style={styles.wholesaleTitle}>Tarifs Dégressifs</Text>
                    </View>
                    <View style={styles.tiersGrid}>
                        {wholesaleTiers.map((tier, index) => {
                            const isActive = activeWholesale && activeWholesale.id === tier.id;
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.tierCard,
                                        isActive && styles.activeTierCard
                                    ]}
                                >
                                    <Text style={[styles.tierQty, isActive && styles.activeTierText]}>
                                        dès {tier.min_quantity} unités
                                    </Text>
                                    <Text style={[styles.tierPrice, isActive && styles.activeTierText]}>
                                        {tier.wholesale_price} FCFA
                                    </Text>
                                    {isActive && (
                                        <View style={styles.activeCheck}>
                                            <Ionicons name="checkmark-circle" size={12} color="#FFF" />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    shopSection: {
        flex: 1,
        gap: 4,
    },
    shopName: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    modeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    modeText: {
        fontSize: 9,
        fontWeight: '800',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    ratingText: {
        fontSize: 12,
        color: '#717171',
    },
    name: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        lineHeight: 28,
        marginBottom: 16,
    },
    priceContainer: {
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
    },
    price: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A1A',
    },
    originalPrice: {
        fontSize: 16,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginTop: 4,
    },
    discountBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
    },
    stockBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    stockText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#059669',
        textTransform: 'uppercase',
    },
    wholesaleSection: {
        marginTop: 4,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    wholesaleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    wholesaleTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
    },
    tiersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tierCard: {
        flex: 1,
        minWidth: '45%',
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeTierCard: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tierQty: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 2,
    },
    tierPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    activeTierText: {
        color: '#FFF',
    },
    activeCheck: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#10B981',
        borderRadius: 10,
        padding: 2,
        borderWidth: 2,
        borderColor: '#FFF',
    },
});

export default React.memo(ProductInfo);
