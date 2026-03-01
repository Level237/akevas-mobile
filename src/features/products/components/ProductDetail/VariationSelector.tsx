import { COLORS } from '@/constants/colors';
import { Color, Variant } from '@/types/product';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    variants: Variant[] | null;
    onVariantChange: (variant: Variant) => void;
};

const VariationSelector = ({ variants, onVariantChange }: Props) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants?.[0] || null);

    if (!variants || variants.length === 0) return null;

    // Extraire les couleurs uniques
    const colors: Color[] = [];
    const seenColors = new Set();
    variants.forEach(v => {
        if (v.color && !seenColors.has(v.color.id)) {
            colors.push(v.color);
            seenColors.add(v.color.id);
        }
    });

    const handleSelectColor = (colorId: number) => {
        const variant = variants.find(v => v.color.id === colorId);
        if (variant) {
            setSelectedVariant(variant);
            onVariantChange(variant);
        }
    };

    return (
        <View style={styles.container}>
            {colors.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Couleur</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color.id}
                                style={[
                                    styles.colorBadge,
                                    selectedVariant?.color.id === color.id && styles.selectedColorBadge
                                ]}
                                onPress={() => handleSelectColor(color.id)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.colorCircle, { backgroundColor: color.hex }]} />
                                <Text style={styles.colorName}>{color.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {selectedVariant?.attributes && selectedVariant.attributes.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {selectedVariant.attributes[0].label || 'Taille'}
                    </Text>
                    <View style={styles.attributesGrid}>
                        {selectedVariant.attributes.map((attr) => (
                            <TouchableOpacity
                                key={attr.id}
                                style={[
                                    styles.attrBadge,
                                    attr.quantity === 0 && styles.outOfStockBadge
                                ]}
                                activeOpacity={attr.quantity > 0 ? 0.7 : 1}
                                disabled={attr.quantity === 0}
                            >
                                <Text style={[
                                    styles.attrText,
                                    attr.quantity === 0 && styles.outOfStockText
                                ]}>
                                    {attr.value}
                                </Text>
                            </TouchableOpacity>
                        ))}
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
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    scrollContent: {
        gap: 12,
    },
    colorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        gap: 8,
    },
    selectedColorBadge: {
        borderColor: COLORS.primary,
        backgroundColor: '#EEF2FF',
    },
    colorCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    colorName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    attributesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    attrBadge: {
        minWidth: 50,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        paddingHorizontal: 15,
    },
    attrText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    outOfStockBadge: {
        backgroundColor: '#F9FAFB',
        borderColor: '#F3F4F6',
        opacity: 0.5,
    },
    outOfStockText: {
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
});

export default React.memo(VariationSelector);
