import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    onBuyNow: () => void;
    onAddToCart: () => void;
    price: string;
    isDisabled?: boolean;
    quantity: number;
    onQuantityChange: (qty: number) => void;
    minQuantity?: number;
};

const ProductActionButton = ({
    onBuyNow,
    onAddToCart,
    price,
    isDisabled = false,
    quantity,
    onQuantityChange,
    minQuantity = 1
}: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {/* Quantity Selector handled in modal now */}

            <View style={styles.actionsBox}>
                <TouchableOpacity
                    style={[styles.cartButton, isDisabled && styles.disabledBtn]}
                    onPress={onAddToCart}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                >
                    <Ionicons name="cart-outline" size={24} color={isDisabled ? '#9CA3AF' : '#333'} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buyButton, isDisabled && styles.disabledBuyBtn]}
                    onPress={onBuyNow}
                    disabled={isDisabled}
                    activeOpacity={0.8}
                >
                    <View style={styles.buyButtonContent}>
                        <Text style={styles.buyButtonText}>
                            {isDisabled ? 'Quantité insuffisante' : 'Commander'}
                        </Text>
                        {!isDisabled && <Ionicons name="chevron-forward" size={18} color="#FFF" />}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 10,
    },

    actionsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cartButton: {
        width: 54,
        height: 54,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: '#F9FAFB',
        opacity: 0.6,
    },
    buyButton: {
        flex: 1,
        height: 54,
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBuyBtn: {
        backgroundColor: '#9CA3AF',
    },
    buyButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});

export default React.memo(ProductActionButton);
