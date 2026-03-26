import { normalizeProduct } from '@/lib/normalizeProduct';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    item: any;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
};

const CartItem = ({ item, onIncrease, onDecrease, onRemove }: Props) => {

    const normalizedProduct = normalizeProduct(item.product);
    const variation = item.selectedVariatio

    // Determine the correct unit price: priority to variation price
    const unitPrice = variation?.price
        ? parseFloat(variation.price)
        : (variation?.attributes?.price
            ? parseFloat(variation.attributes.price)
            : parseFloat(normalizedProduct.product_price));
    return (
        <View style={styles.container}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: normalizedProduct.product_profile }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />
            </View>

            {/* Product Details */}
            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={2}>
                        {normalizedProduct.product_name}
                    </Text>
                    <TouchableOpacity
                        onPress={() => onRemove(item.product.id)}
                        style={styles.removeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Variations Display */}
                {(variation?.color || variation?.attributes) && (
                    <View style={styles.variationRow}>
                        {variation?.color && (
                            <View style={styles.variantBadge}>
                                <View
                                    style={[
                                        styles.colorDot,
                                        { backgroundColor: variation.color.hex || '#CCCCCC' }
                                    ]}
                                />
                                <Text style={styles.variantText}>{variation.color.name}</Text>
                            </View>
                        )}
                        {variation?.attributes && (
                            <View style={styles.variantBadge}>
                                <Text style={styles.variantText}>
                                    {variation.attributes.value || variation.attributes.label}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <Text style={styles.location}>Ville: {item.product.residence}</Text>

                <View style={styles.footerRow}>
                    {/* Quantity Selector */}
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity
                            onPress={() => onDecrease(item)}
                            style={styles.quantityBtn}
                            activeOpacity={0.6}
                        >
                            <Ionicons name="remove" size={16} color="#1A1A1A" />
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={() => onIncrease(item)}
                            style={styles.quantityBtn}
                            activeOpacity={0.6}
                        >
                            <Ionicons name="add" size={16} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.price}>{unitPrice.toLocaleString()} FCFA</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 16,
        // Soft shadow for premium feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F9F9F9',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    details: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        lineHeight: 20,
        marginRight: 8,
    },
    removeButton: {
        padding: 2,
    },
    location: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        paddingHorizontal: 4,
    },
    quantityBtn: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginHorizontal: 12,
        textAlign: 'center',
        minWidth: 16,
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    variationRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 6,
        marginBottom: 4,
    },
    variantBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 6,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    variantText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
});
export default CartItem;
