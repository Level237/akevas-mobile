
import HeaderTabs from '@/components/common/HeaderTabs';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CartItem from '../components/CartItem';
import EmptyCart from '../components/EmptyCart';
import OrderSummary from '../components/OrderSummary';
import { CartItemType } from '../types';

const MOCK_CART_ITEMS: CartItemType[] = [
    {
        id: '1',
        title: 'Montre sorou versions orignal',
        price: 55000,
        image: require('@/assets/images/shop1.webp'),
        location: 'Douala',
        quantity: 1,
    },
];

const CartPage = () => {
    const [items, setItems] = useState<CartItemType[]>(MOCK_CART_ITEMS);
    const isEmpty = items.length === 0;

    const subtotal = useMemo(() =>
        items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [items]);

    const deliveryFee = isEmpty ? 0 : 5000;
    const total = subtotal + deliveryFee;

    const handleIncrease = (id: string) => {
        setItems(curr => curr.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const handleDecrease = (id: string) => {
        setItems(curr => curr.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const handleRemove = (id: string) => {
        setItems(curr => curr.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        console.log('Proceeding to checkout with total:', total);
    };

    return (
        <View style={styles.container}>
            <HeaderTabs title="Panier" />

            {isEmpty ? (
                <EmptyCart />
            ) : (
                <>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Cart Items List */}
                        <View style={styles.section}>
                            {items.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </View>
                    </ScrollView>

                    {/* Summary Footer */}
                    <OrderSummary
                        subtotal={subtotal}
                        deliveryFee={deliveryFee}
                        total={total}
                        onCheckout={handleCheckout}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 8,
    },
});

export default CartPage;
