import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CheckoutInfo = {
    price: string | number;
    attributeVariationId: number | null;
    productVariationId: number | null;
    mainImage?: string | null;
    color?: {
        id: number;
        name: string;
        hex: string;
    } | null;
    attribute?: string | null;
    label?: string | null;
    variantName?: string | null;
    quantity: number;
    group?: string | null;
};

type Props = {
    isVisible: boolean;
    onClose: () => void;
    product: any;
    currentInfo: CheckoutInfo;
    quantity: number;
    onQuantityChange: (qty: number) => void;
    minQuantity?: number;
    onProceed: () => void;
};

const CheckoutDrawer = ({
    isVisible,
    onClose,
    product,
    currentInfo,
    quantity,
    onQuantityChange,
    minQuantity = 1,
    onProceed,
}: Props) => {
    const insets = useSafeAreaInsets();

    const increment = () => {
        if (quantity < (currentInfo.quantity || 999)) {
            onQuantityChange(quantity + 1);
        }
    };

    const decrement = () => {
        if (quantity > minQuantity) {
            onQuantityChange(quantity - 1);
        }
    };

    const displayImage = currentInfo.mainImage || product?.product_profile;
    const totalPrice = Number(currentInfo.price) * quantity;

    if (!isVisible) return null;

    const handleBackdropPress = () => {
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={handleBackdropPress}
                >
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                    />
                </Pressable>

                <Animated.View
                    entering={SlideInDown.springify().damping(20).stiffness(150)}
                    exiting={SlideOutDown}
                    style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
                >
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>Finaliser l'achat</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Product Summary */}
                    <View style={styles.productCard}>
                        <Image
                            source={{ uri: displayImage }}
                            style={styles.productImage}
                            contentFit="cover"
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName} numberOfLines={2}>
                                {product?.product_name}
                            </Text>

                            {currentInfo.color && (
                                <View style={styles.variantInfo}>
                                    <View
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: currentInfo.color.hex },
                                        ]}
                                    />
                                    <Text style={styles.variantText}>Couleur: {currentInfo.color.name}</Text>
                                </View>
                            )}

                            {currentInfo.attribute && (
                                <Text style={styles.variantText}>
                                    Taille: {currentInfo.attribute} {currentInfo.label || ''}
                                </Text>
                            )}

                            <Text style={styles.stockText}>
                                Stock disponible: {currentInfo.quantity}
                            </Text>

                            <Text style={styles.unitPrice}>
                                {currentInfo.price} FCFA
                            </Text>
                        </View>
                    </View>

                    {/* Quantity Selector */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Quantité</Text>
                        <View style={styles.quantityControl}>
                            <TouchableOpacity
                                style={[styles.qtyBtn, quantity <= minQuantity && styles.qtyBtnDisabled]}
                                onPress={decrement}
                                disabled={quantity <= minQuantity}
                            >
                                <Ionicons name="remove" size={20} color={quantity <= minQuantity ? '#9CA3AF' : '#111827'} />
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity
                                style={[styles.qtyBtn, quantity >= (currentInfo.quantity || 999) && styles.qtyBtnDisabled]}
                                onPress={increment}
                                disabled={quantity >= (currentInfo.quantity || 999)}
                            >
                                <Ionicons name="add" size={20} color={quantity >= (currentInfo.quantity || 999) ? '#9CA3AF' : '#111827'} />
                            </TouchableOpacity>
                        </View>
                        {minQuantity > 1 && (
                            <Text style={styles.minQtyText}>Minimum requis: {minQuantity}</Text>
                        )}
                    </View>

                    {/* Total & CTA */}
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{totalPrice} FCFA</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.proceedButton}
                            onPress={onProceed}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.proceedButtonText}>Procéder à l'achat</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 20,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 16,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    closeBtn: {
        padding: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        gap: 16,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    variantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    variantText: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 2,
    },
    stockText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    unitPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.primary,
    },
    quantitySection: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    quantityLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
        textAlign: 'center',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    qtyBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    qtyBtnDisabled: {
        backgroundColor: '#F3F4F6',
        shadowOpacity: 0,
        elevation: 0,
    },
    qtyValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        minWidth: 40,
        textAlign: 'center',
    },
    minQtyText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
    },
    footer: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
    },
    proceedButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default CheckoutDrawer;
