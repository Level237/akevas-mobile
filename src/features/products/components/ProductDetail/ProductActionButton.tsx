import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    onBuyNow: () => void;
    onAddToCart: () => void;
    price: string;
};

const ProductActionButton = ({ onBuyNow, onAddToCart, price }: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <TouchableOpacity
                style={styles.cartButton}
                onPress={onAddToCart}
                activeOpacity={0.7}
            >
                <Ionicons name="cart-outline" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buyButton}
                onPress={onBuyNow}
                activeOpacity={0.8}
            >
                <View style={styles.buyButtonContent}>
                    <Text style={styles.buyButtonText}>Acheter maintenant</Text>
                    <Ionicons name="chevron-forward" size={18} color="#FFF" />
                </View>
            </TouchableOpacity>
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
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        alignItems: 'center',
        gap: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    cartButton: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    buyButton: {
        flex: 1,
        height: 54,
        backgroundColor: '#6366F1', // Premium Indigo
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default React.memo(ProductActionButton);
