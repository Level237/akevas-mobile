import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    name: string;
    price: string;
    rating: number | null;
    reviewCount: number | null;
    shopName: string;
};

const ProductInfo = ({ name, price, rating, reviewCount, shopName }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.shopName}>{shopName}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#E67E22" />
                    <Text style={styles.ratingText}>
                        {rating || '0.0'} ({reviewCount || 0} avis)
                    </Text>
                </View>
            </View>

            <Text style={styles.name}>{name}</Text>

            <View style={styles.priceRow}>
                <Text style={styles.price}>{price} FCFA</Text>
                <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>En stock</Text>
                </View>
            </View>
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
        alignItems: 'center',
        marginBottom: 8,
    },
    shopName: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    price: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1A1A',
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
});

export default React.memo(ProductInfo);
